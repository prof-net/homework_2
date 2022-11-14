import {connectDbPosts} from "./db";
import {ObjectId} from "mongodb";
import {IPost, IPostSort, IQueryPost} from "../types/typesPosts";

export const postsQueryRepository = {
    async getAllPosts(query: IQueryPost, blogId: string | undefined): Promise<IPostSort> {
        const blogFilter = blogId ? {blogId: new ObjectId(blogId)} : {}
        const sortDirection: 'asc' | 'desc'  = query.sortDirection === 'asc' ? 'asc' : 'desc';
        const sortBy: string  = query.sortBy || 'createdAt';
        const pageNumber: number  = Number(query.pageNumber) || 1;
        const pageSize: number  = Number(query.pageSize) || 10;
        const totalCount = await connectDbPosts.count(blogFilter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const result = await connectDbPosts.find(blogFilter).skip((pageNumber-1)*pageSize).limit(pageSize).sort(sortBy, sortDirection).toArray();

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