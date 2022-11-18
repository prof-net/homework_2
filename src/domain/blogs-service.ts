import { blogsRepository } from '../repositories/blogs/blogs-repository-mongo';
import {IBlog} from "../types/typesBlogs";

export const blogsService = {
    async createBlog(name: string, websiteUrl:string, description: string): Promise<IBlog | null> {
        const result = await blogsRepository.createBlog(name, websiteUrl, description);
        if (result) {
            return {
                id: result._id.toString(),
                name: result.name,
                websiteUrl: result.websiteUrl,
                description: result.description,
                createdAt: result.createdAt
            };
        } else {
            return null;
        }
    },

    async changeBlog(id: string, name: string, websiteUrl: string, description: string):Promise<boolean> {
        return blogsRepository.changeBlog(id, name, websiteUrl, description);
    },

    async deleteBlog(id: string):Promise<boolean> {
        return blogsRepository.deleteBlog(id);
    }
}