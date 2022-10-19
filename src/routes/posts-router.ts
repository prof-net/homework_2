import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {blogsRepository} from "../repositories/blogs-repository";

export const postsRouter = Router({});

const titleLengthValidation = body('title').exists().trim().isLength({min: 1, max: 30}).withMessage("Title should be less 30 symbols");
const shortDescriptionLengthValidation = body('shortDescription').exists().trim().isLength({min: 1, max: 100}).withMessage("ShortDescription should be less 100 symbols");
const contentLengthValidation = body('content').exists().trim().isLength({min: 1, max: 1000}).withMessage("Content should be less 1000 symbols");
const blogIdValidation = body('blogId').exists().custom(value => {
    if (!blogsRepository.getBlogs().find(blog => blog.id === value)) {
        throw new Error("Blog isn't exist");
    }
    return true;
});

//get all posts
postsRouter.get('/posts', (req: Request, res: Response) => {
    res.send(postsRepository.getAllPosts());
});

//get single post
postsRouter.get('/posts/:id', (req: Request, res: Response) => {
    const result = postsRepository.getSinglePost(req.params.id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(404).send(result);
    }
});

//create new post
postsRouter.post('/posts',
    basicAuthMiddleware,
    titleLengthValidation,
    shortDescriptionLengthValidation,
    contentLengthValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
    const result = postsRepository.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId
    );
    if (result) {
        res.status(201).send(result);
    } else {
        res.status(401);
    }

});

//change new post
postsRouter.put('/posts/:id',
    basicAuthMiddleware,
    titleLengthValidation,
    shortDescriptionLengthValidation,
    contentLengthValidation,
    blogIdValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
    const result = postsRepository.changePost(
        req.params.id,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId
    );
    if (result) {
        res.send(204);
    } else {
        res.send(404);
    }
});

//delete single post
postsRouter.delete('/posts/:id',
    basicAuthMiddleware,
    (req: Request, res: Response) => {
    const result = postsRepository.deletePost(req.params.id);
    if (result) {
        res.send(204);
    } else {
        res.send(404);
    }
})