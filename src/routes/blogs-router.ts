import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsRouter = Router({});

blogsRouter.get('/blogs', (req: Request, res: Response) => {
    res.send(blogsRepository.getAllBlogs());
});