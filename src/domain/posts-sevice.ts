import { postsRepository } from '../repositories/posts/posts-repository-mongo';
import {IPost} from "../types/typesPosts";

export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | null> {
        const result = await postsRepository.createPost(title, shortDescription, content, blogId);
        if (result) {
            return {
                id: result._id.toString(),
                title: result.title,
                shortDescription: result.shortDescription,
                content: result.content,
                blogId: result.blogId.toString(),
                blogName: result.blogName,
                createdAt: result.createdAt
            };
        } else {
            return null;
        }
    },

    async changePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepository.changePost(id, title, shortDescription, content, blogId);
    },

    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id);
    }
}