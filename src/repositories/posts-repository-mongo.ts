import {connectDbBlogs, connectDbPosts} from "./db";
import {ObjectId} from "mongodb";
import {IPostMongo} from "../types/types";

export const postsRepository = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<IPostMongo | null> {
        if (!ObjectId.isValid(blogId)) {
            return null;
        }
        const blog = await connectDbBlogs.findOne({_id: new ObjectId(blogId)});
        if (!blog) {
            return null;
        }
        const result = await connectDbPosts.insertOne({
            _id: new ObjectId(),
            title,
            shortDescription,
            content,
            blogId: blog._id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        });
        return await connectDbPosts.findOne({_id: result.insertedId});
    },

    async changePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbPosts.updateOne(
            {_id: new ObjectId(id)},
            {$set: {title, shortDescription, content, blogId: new ObjectId(blogId)}})
        return Boolean(result.modifiedCount);
    },

    async deletePost(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbPosts.deleteOne({_id: new ObjectId(id)});
        return Boolean(result.deletedCount);
    },
}