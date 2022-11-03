import { postsRepository } from '../repositories/posts-repository-mongo';

interface IPost {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export const postsService = {
    async getAllPosts(): Promise<IPost[]> {
        const result = await postsRepository.getAllPosts();
        return result.map(item => {
            return {
                id: item._id.toString(),
                title: item.title,
                shortDescription: item.shortDescription,
                content: item.content,
                blogId: item.blogId.toString(),
                blogName: item.blogName,
                createdAt: item.createdAt
            }
        })
    },

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

    async getSinglePost(id: string): Promise<IPost | null> {
        const result = await postsRepository.getSinglePost(id);
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
            return null
        }
    },

    async changePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return postsRepository.changePost(id, title, shortDescription, content, blogId);
    },

    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id);
    },
}