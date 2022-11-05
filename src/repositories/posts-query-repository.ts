import {connectDbBlogs, connectDbPosts} from "./db";
import {ObjectId} from "mongodb";
import {IPost, IPostSort, IQueryPost} from "../types/types";

export const postsQueryRepository = {
    async getAllPosts(query: IQueryPost, blogId: string | undefined): Promise<IPostSort> {
        const sortDirection: 'asc' | 'desc'  = query.sortDirection === 'desc' ? 'desc' : 'asc';
        const sortBy: string  = query.sortBy || 'createdAt';
        const pageNumber: number  = Number(query.pageNumber) || 1;
        const pageSize: number  = Number(query.pageSize) || 10;
        const totalCount = await connectDbBlogs.count({});
        const pagesCount = Math.ceil(totalCount / pageSize);
        const blogFilter = blogId ? {_id: new ObjectId(blogId)} : {}

        const result = await connectDbPosts.find(blogFilter).skip((pageNumber-1)*pageSize).limit(pageNumber * pageSize).sort(sortBy, sortDirection).toArray();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: result.map(item => {
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
        }

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