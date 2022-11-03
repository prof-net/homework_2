import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-sevice";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {blogsQueryRepository} from "../repositories/blogs-query-repository";
import {postsQueryRepository} from "../repositories/posts-query-repository";

export const postsRouter = Router({});

const titleLengthValidation = body('title').exists().trim().isLength({min: 1, max: 30}).withMessage("Title should be less 30 symbols");
const shortDescriptionLengthValidation = body('shortDescription').exists().trim().isLength({min: 1, max: 100}).withMessage("ShortDescription should be less 100 symbols");
const contentLengthValidation = body('content').exists().trim().isLength({min: 1, max: 1000}).withMessage("Content should be less 1000 symbols");
const blogIdValidation = body('blogId').exists().custom(async (value) => {
    const result = await blogsQueryRepository.getSingleBlog(value);
    if (!result) {
        throw new Error("Blog isn't exist");
    }
    return true;
});

//get all posts
postsRouter.get('/posts', async (req: Request, res: Response) => {
    res.send(await postsQueryRepository.getAllPosts());
});

//get single post
postsRouter.get('/posts/:id', async (req: Request, res: Response) => {
    const result = await postsQueryRepository.getSinglePost(req.params.id);
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
    async (req: Request, res: Response) => {
    const result = await postsService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId
    );
    if (result) {
        res.status(201).send(result);
    } else {
        res.sendStatus(401);
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
    async (req: Request, res: Response) => {
    const result = await postsService.changePost(
        req.params.id,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId
    );
    if (result) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

//delete single post
postsRouter.delete('/posts/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
    const result = await postsService.deletePost(req.params.id);
    if (result) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
})