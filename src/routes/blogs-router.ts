import {NextFunction, Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {contentLengthValidation, shortDescriptionLengthValidation, titleLengthValidation} from "./posts-router";
import {postsService} from "../domain/posts-sevice";
import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithQuery, RequestWithQueryParams} from "../types/types";
import {IBlog, IBlogBody, IQueryBlog, IBlogSort} from '../types/typesBlogs';
import {IPost, IPostBody, IPostSort, IQueryPost,} from '../types/typesPosts';

export const blogsRouter = Router({});

const idBlogValidation = async (req: Request, res: Response, next: NextFunction) => {
    const blogId = await blogsQueryRepository.getSingleBlog(req.params.blogId);
    if (!blogId) {
        res.sendStatus(404);
    } else {
        next();
    }
}

const nameLengthValidation = body('name').exists().trim().isLength({
    min: 1,
    max: 15
}).withMessage("Name should be less 15 symbols");

const websiteUrlLengthValidation = body('websiteUrl').exists().trim().isLength({max: 100}).withMessage("websiteUrl should be less 100 symbols");
const descriptionLengthValidation = body('websiteUrl').exists().trim().isLength({max: 500}).withMessage("description should be less 500 symbols");

// const websiteUrlLinkValidation = body('websiteUrl').matches(new RegExp("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$")).withMessage("websiteUrl should be link");

//get all blogs
blogsRouter.get('/blogs', async (req: RequestWithQuery<IQueryBlog>, res: Response<IBlogSort>) => {
    res.status(200).send(await blogsQueryRepository.getAllBlogs(req.query));
});

//get single blogs
blogsRouter.get('/blogs/:id', async (req: RequestWithParams<{id: string}>, res: Response<IBlog>) => {
    const blog = await blogsQueryRepository.getSingleBlog(req.params.id);
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
    websiteUrlLengthValidation,
    // websiteUrlLinkValidation,
    descriptionLengthValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<IBlogBody>, res: Response<IBlog | null>) => {
        res.status(201).send(await blogsService.createBlog(req.body.name, req.body.websiteUrl, req.body.description));
    });

//create new post for blog
blogsRouter.post('/blogs/:blogId/posts',
    basicAuthMiddleware,
    idBlogValidation,
    titleLengthValidation,
    shortDescriptionLengthValidation,
    contentLengthValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsBody<{blogId: string}, IPostBody>, res: Response<IPost | null>) => {
        res.status(201).send(await postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.params.blogId
        ));
    });

//get all posts for blog
blogsRouter.get('/blogs/:blogId/posts',
    idBlogValidation,
    async (req: RequestWithQueryParams<IQueryPost, {blogId: string}>, res: Response<IPostSort>) => {
    res.status(200).send(await postsQueryRepository.getAllPosts(req.query, req.params.blogId));
});

//change single blog
blogsRouter.put('/blogs/:id',
    basicAuthMiddleware,
    nameLengthValidation,
    websiteUrlLengthValidation,
    descriptionLengthValidation,
    // websiteUrlLinkValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsBody<{id: string}, IBlogBody>, res: Response<boolean>) => {
        const result = await blogsService.changeBlog(req.params.id, req.body.name, req.body.websiteUrl, req.body.description);
        if (result) {
            res.status(204).send(result);
        } else {
            res.sendStatus(404);
        }
    });

//delete single blog
blogsRouter.delete('/blogs/:id',
    basicAuthMiddleware,
    async (req: RequestWithParams<{id: string}>, res: Response) => {
        const result = await blogsService.deleteBlog(req.params.id);
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })


