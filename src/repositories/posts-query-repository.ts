import {connectDbPosts} from "./db";
import {ObjectId} from "mongodb";
import {IPost} from "../types/types";

export const postsQueryRepository = {
    async getAllPosts(): Promise<IPost[]> {
        const result = await connectDbPosts.find({}).toArray();
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

    async getSinglePost(id: string): Promise<IPost | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        const result =  await connectDbPosts.findOne({_id: new ObjectId(id)});
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
}