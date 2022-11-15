import {Response, Router} from "express";
import {postsService} from "../domain/posts-sevice";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithQuery, RequestWithQueryParams
} from "../types/types";
import {
    IPost, IPostBody,
    IPostSort,
    IQueryPost,
} from '../types/typesPosts';
import {blogsRouter} from "./blogs-router";
import {IComment, ICommentBody, ICommentSort, IQueryComment} from "../types/typesComments";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {commentsService} from "../domain/comments-service";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";

export const postsRouter = Router({});

export const titleLengthValidation = body('title').exists().trim().isLength({
    min: 1,
    max: 30
}).withMessage("Title should be less 30 symbols");

export const shortDescriptionLengthValidation = body('shortDescription').exists().trim().isLength({
    min: 1,
    max: 100
}).withMessage("ShortDescription should be less 100 symbols");

export const contentLengthValidation = body('content').exists().trim().isLength({
    min: 1,
    max: 1000
}).withMessage("Content should be less 1000 symbols");

const blogIdValidation = body('blogId').exists().custom(async (value) => {
    const result = await blogsQueryRepository.getSingleBlog(value);
    if (!result) {
        throw new Error("Blog isn't exist");
    }
    return true;
});

export const contentCommentLengthValidation = body('content').exists().trim().isLength({
    min: 20,
    max: 300
}).withMessage("Content should be more 20 less 300 symbols");

//get all posts
postsRouter.get('/posts', async (req: RequestWithQuery<IQueryPost>, res: Response<IPostSort>) => {
    res.send(await postsQueryRepository.getAllPosts(req.query, undefined));
});

//get single post
postsRouter.get('/posts/:id', async (req: RequestWithParams<{ id: string }>, res: Response<IPost | null>) => {
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
    async (req: RequestWithBody<IPostBody>, res: Response<IPost | null>) => {
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

//change single post
postsRouter.put('/posts/:id',
    basicAuthMiddleware,
    titleLengthValidation,
    shortDescriptionLengthValidation,
    contentLengthValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, IPostBody>, res: Response<IPost | null>) => {
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
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const result = await postsService.deletePost(req.params.id);
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })

//get all comments for post
postsRouter.get('/posts/:postId/comments',
    async (req: RequestWithQueryParams<IQueryComment, {postId: string}>, res: Response<ICommentSort>) => {
        res.status(200).send(await commentsQueryRepository.getAllComments(req.query, req.params.postId));
    });

//create new comment for post
blogsRouter.post('/posts/:postsId/comments',
    contentCommentLengthValidation,
    bearerAuthMiddleware,
    async (req: RequestWithParamsBody<{postId: string}, ICommentBody>, res: Response<IComment | null>) => {
        res.status(201).send(await commentsService.createComment(
            req.body.content,
            req.params.postId,
            req.user!
        ));
    });