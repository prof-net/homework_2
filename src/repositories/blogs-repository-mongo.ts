import {connectDbBlogs} from "./db";
import {ObjectId} from "mongodb";

export interface IBlogMongo  {
    _id: ObjectId;
    name: string;
    youtubeUrl: string;
    createdAt: string;
}

export const blogsRepository = {
    async getAllBlogs(): Promise<IBlogMongo[]> {
        return await connectDbBlogs.find({}).toArray();
    },

    async getSingleBlog(id: string): Promise<IBlogMongo | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        return await connectDbBlogs.findOne({_id: new ObjectId(id)});
    },

    async createBlog(name: string, youtubeUrl:string): Promise<IBlogMongo | null> {
        const result = await connectDbBlogs.insertOne({_id: new ObjectId, name, youtubeUrl, createdAt: new Date().toISOString()});
        return await connectDbBlogs.findOne({_id: result.insertedId});
    },

    async changeBlog(id: string, name: string, youtubeUrl: string):Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbBlogs.updateOne({_id: new ObjectId(id)}, {$set: {name, youtubeUrl}})
        return Boolean(result.modifiedCount);
    },

    async deleteBlog(id: string):Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbBlogs.deleteOne({_id: new ObjectId(id)});
        return Boolean(result.deletedCount);
    },
}