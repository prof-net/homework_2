import {connectDbBlogs, connectDbPosts} from "./db";
import {ObjectId} from "mongodb";

interface IPost {
    id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
}

export interface IPostMongo {
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
}

export const postsRepository = {
    async getAllPosts(): Promise<IPost[]> {
        const result = await connectDbPosts.find({}).toArray();
        return result.map(item => {
            return {
                id: item._id,
                title: item.title,
                shortDescription: item.shortDescription,
                content: item.content,
                blogId: item.blogId,
                blogName: item.blogName
            }
        })
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | null> {
        const blog = await connectDbBlogs.findOne({_id: new ObjectId(blogId)});
        if (!blog) {
            return null;
        }
        const result = await connectDbPosts.insertOne({
            title,
            shortDescription,
            content,
            blogId: blog._id,
            blogName: blog.name
        });
        const post = await connectDbPosts.findOne({_id: result.insertedId});
        if (post) {
            return {
                id: post._id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName
            };
        } else {
            return null;
        }
    },

    async getSinglePost(id: string): Promise<IPost | null> {
        const result = await connectDbPosts.findOne({_id: new ObjectId(id)});
        if (result) {
            return {
                id: result._id,
                title: result.title,
                shortDescription: result.shortDescription,
                content: result.content,
                blogId: result.blogId,
                blogName: result.blogName
            };
        } else {
            return null
        }
    },

    async changePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await connectDbPosts.updateOne(
            {_id: new ObjectId(id)},
            {$set: {title, shortDescription, content, blogId: new ObjectId(blogId)}})
        return result.acknowledged;
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await connectDbBlogs.deleteOne({_id: new ObjectId(id)});
        return result.acknowledged;
    },
}