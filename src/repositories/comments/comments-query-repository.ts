import {connectDbComments, connectDbPosts} from "../db";
import {ObjectId} from "mongodb";
import {IComment, ICommentSort, IQueryComment} from "../../types/typesComments";
import {IUser} from "../../types/typesUsers";

export const commentsQueryRepository = {
    async getAllComments(query: IQueryComment, postId: string | undefined, user: IUser): Promise<ICommentSort> {
        const postFilter = postId ? {postId: new ObjectId(postId)} : {}
        const sortDirection: 'asc' | 'desc'  = query.sortDirection === 'asc' ? 'asc' : 'desc';
        const sortBy: string  = query.sortBy || 'createdAt';
        const pageNumber: number  = Number(query.pageNumber) || 1;
        const pageSize: number  = Number(query.pageSize) || 10;
        const totalCount = await connectDbComments.count(postFilter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const result = await connectDbComments.find(postFilter).skip((pageNumber-1)*pageSize).limit(pageSize).sort(sortBy, sortDirection).toArray();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: result.map(item => {
                return {
                    id: item._id.toString(),
                    content: item.content,
                    userId: user.id,
                    userLogin: user.login,
                    createdAt: item.createdAt
                }
            })
        }
    },


    async getSingleComment(id: string): Promise<IComment | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        }
        const result =  await connectDbComments.findOne({_id: new ObjectId(id)});
        if (result) {
            return {
                id: result._id.toString(),
                content: result.content,
                userId: result.userId,
                userLogin: result.userLogin,
                createdAt: result.createdAt,
            };
        } else {
            return null
        }
    },
}