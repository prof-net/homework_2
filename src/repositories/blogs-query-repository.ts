import {connectDbBlogs} from "./db";
import {ObjectId} from "mongodb";
import {IBlog} from "../types/types";

export const blogsQueryRepository = {
    async getAllBlogs(): Promise<IBlog[]> {
        const result = await connectDbBlogs.find({}).toArray();
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
        if (!ObjectId.isValid(id)) {
            return null;
        }
        const result =  await connectDbBlogs.findOne({_id: new ObjectId(id)});
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
}