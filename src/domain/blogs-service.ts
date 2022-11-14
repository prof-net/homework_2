import { blogsRepository } from '../repositories/blogs-repository-mongo';
import {IBlog} from "../types/typesBlogs";

export const blogsService = {
    async createBlog(name: string, youtubeUrl:string): Promise<IBlog | null> {
        const result = await blogsRepository.createBlog(name, youtubeUrl);
        if (result) {
            return {
                id: result._id.toString(),
                name: result.name,
                youtubeUrl: result.youtubeUrl,
                createdAt: result.createdAt
            };
        } else {
            return null;
        }
    },

    async changeBlog(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        return blogsRepository.changeBlog(id, name, youtubeUrl);
    },

    async deleteBlog(id: string):Promise<boolean> {
        return blogsRepository.deleteBlog(id);
    }
}