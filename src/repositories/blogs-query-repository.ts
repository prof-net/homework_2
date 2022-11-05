import {connectDbBlogs} from "./db";
import {ObjectId} from "mongodb";
import {IBlog, IBlogSort, IQueryBlog} from "../types/types";

export const blogsQueryRepository = {
    async getAllBlogs(query: IQueryBlog): Promise<IBlogSort> {
        const sortDirection: 'asc' | 'desc'  = query.sortDirection === 'desc' ? 'desc' : 'asc';
        const sortBy: string  = query.sortBy || 'createdAt';
        const pageNumber: number  = Number(query.pageNumber) || 1;
        const pageSize: number  = Number(query.pageSize) || 10;
        const searchNameTerm  = query.searchNameTerm ?  {name: { $regex: query.searchNameTerm}} : {};
        const totalCount = await connectDbBlogs.count({});
        const pagesCount = Math.ceil(totalCount / pageSize);

        const result = await connectDbBlogs.find(searchNameTerm).skip((pageNumber-1)*pageSize).limit(pageNumber * pageSize).sort(sortBy, sortDirection).toArray();
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: result.map(item => {
                return {
                    id: item._id.toString(),
                    name: item.name,
                    youtubeUrl: item.youtubeUrl,
                    createdAt: item.createdAt,
                }
            })
        }
    },

    async getSingleBlog(id: string): Promise<IBlog | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        const result = await connectDbBlogs.findOne({_id: new ObjectId(id)});
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