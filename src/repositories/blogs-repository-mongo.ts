import {connectDbBlogs} from "./db";
import {ObjectId} from "mongodb";

export interface IBlog {
    id: ObjectId;
    name: string;
    youtubeUrl: string;
}

export interface IBlogMongo  {
    name: string;
    youtubeUrl: string;
}

export const blogsRepository = {
    async getAllBlogs(): Promise<IBlog[]> {
        const result = await connectDbBlogs.find({}).toArray();
        return result.map(item => {
            return {
                id: item._id,
                name: item.name,
                youtubeUrl: item.youtubeUrl
            }
        });
    },

    async getSingleBlog(id: string): Promise<IBlog | null> {
        const result = await connectDbBlogs.findOne({_id: new ObjectId(id)});
        if (result) {
            return {
                id: result._id,
                name: result.name,
                youtubeUrl: result.youtubeUrl
            };
        } else {
            return null;
        }
    },

    async createBlog(name: string, youtubeUrl:string): Promise<IBlog | null> {
        const result = await connectDbBlogs.insertOne({ name, youtubeUrl});
        const blog = await connectDbBlogs.findOne({_id: result.insertedId});
        if (blog) {
            return {
                id: blog._id,
                name: blog.name,
                youtubeUrl: blog.youtubeUrl
            };
        } else {
            return null;
        }
    },

    async changeBlog(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        const result = await connectDbBlogs.updateOne({_id: new ObjectId(id)}, {$set: {name, youtubeUrl}})
        return result.acknowledged;
    },

    async deleteBlog(id: string):Promise<boolean> {
        const result = await connectDbBlogs.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    },
}