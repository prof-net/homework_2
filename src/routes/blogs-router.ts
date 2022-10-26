import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository-mongo";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";

export const blogsRouter = Router({});

const nameLengthValidation = body('name').exists().trim().isLength({
    min: 1,
    max: 15
}).withMessage("Name should be less 15 symbols");
const youtubeUrlLengthValidation = body('youtubeUrl').exists().trim().isLength({max: 100}).withMessage("YoutubeUrl should be less 100 symbols");
const youtubeUrlLinkValidation = body('youtubeUrl').matches(new RegExp("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$")).withMessage("YoutubeUrl should be link");

//get all blogs
blogsRouter.get('/blogs', async (req: Request, res: Response) => {
    res.status(200).send(await blogsRepository.getAllBlogs());
});

//get single blogs
blogsRouter.get('/blogs/:id', async (req: Request, res: Response) => {
    const blog = await blogsRepository.getSingleBlog(req.params.id);
    if (blog) {
        res.status(200).send(blog);
    } else {
        res.send(404);
    }

});

//create new blog
blogsRouter.post('/blogs',
    basicAuthMiddleware,
    nameLengthValidation,
    youtubeUrlLengthValidation,
    youtubeUrlLinkValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        res.status(201).send(await blogsRepository.createBlog(req.body.name, req.body.youtubeUrl));
    });

//change new blog
blogsRouter.put('/blogs/:id',
    basicAuthMiddleware,
    nameLengthValidation,
    youtubeUrlLengthValidation,
    youtubeUrlLinkValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await blogsRepository.changeBlog(req.params.id, req.body.name, req.body.youtubeUrl);

        console.log('1111111111')
        console.log(result)
        console.log('1111111111')
        if (result) {
            res.status(204).send(result);
        } else {
            res.send(404);
        }
    });

//delete single blog
blogsRouter.delete('/blogs/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const result = await blogsRepository.deleteBlog(req.params.id);
        if (result) {
            res.send(204);
        } else {
            res.send(404);
        }
    })