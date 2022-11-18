import {connectDbBlogs} from "../db";
import {ObjectId} from "mongodb";
import {IBlogMongo} from "../../types/typesBlogs";

export const blogsRepository = {
    async createBlog(name: string, websiteUrl:string, description: string): Promise<IBlogMongo | null> {
        const result = await connectDbBlogs.insertOne({_id: new ObjectId, name, websiteUrl, description, createdAt: new Date().toISOString()});
        return await connectDbBlogs.findOne({_id: result.insertedId});
    },

    async changeBlog(id: string, name: string, websiteUrl: string, description: string):Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbBlogs.updateOne({_id: new ObjectId(id)}, {$set: {name, websiteUrl, description}})
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