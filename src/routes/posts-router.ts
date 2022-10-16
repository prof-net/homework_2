import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";

export const postsRouter = Router({});

postsRouter.get('/posts', (req: Request, res: Response) => {
    res.send(postsRepository.getAllPosts());
});