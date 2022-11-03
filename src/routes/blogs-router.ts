import {Request, Response, Router} from "express";
import { blogsService } from "../domain/blogs-service";
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
    res.status(200).send(await blogsService.getAllBlogs());
});

//get single blogs
blogsRouter.get('/blogs/:id', async (req: Request, res: Response) => {
    const blog = await blogsService.getSingleBlog(req.params.id);
    if (blog) {
        res.status(200).send(blog);
    } else {
        res.sendStatus(404);
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
        res.status(201).send(await blogsService.createBlog(req.body.name, req.body.youtubeUrl));
    });

//change new blog
blogsRouter.put('/blogs/:id',
    basicAuthMiddleware,
    nameLengthValidation,
    youtubeUrlLengthValidation,
    youtubeUrlLinkValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await blogsService.changeBlog(req.params.id, req.body.name, req.body.youtubeUrl);
        if (result) {
            res.status(204).send(result);
        } else {
            res.sendStatus(404);
        }
    });

//delete single blog
blogsRouter.delete('/blogs/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {
        const result = await blogsService.deleteBlog(req.params.id);
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })