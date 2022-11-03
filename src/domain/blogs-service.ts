import { blogsRepository } from '../repositories/blogs-repository-mongo';

export interface IBlog {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
}

export const blogsService = {
    async getAllBlogs(): Promise<IBlog[]> {
        const result = await blogsRepository.getAllBlogs()
        return result.map(item => {
            return {
                id: item._id.toString(),
                name: item.name,
                youtubeUrl: item.youtubeUrl,
                createdAt: item.createdAt,
            }
        });
    },

    async getSingleBlog(id: string): Promise<IBlog | null> {
        const result = await blogsRepository.getSingleBlog(id);
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
    },
}