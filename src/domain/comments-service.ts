import {commentsRepository} from "../repositories/comments/comments-repository-mongo";
import {IComment} from "../types/typesComments";
import {IUser} from "../types/typesUsers";

export const commentsService = {
    async createComment(content: string, postId: string, user: IUser): Promise<IComment | null> {
        const result = await commentsRepository.createComment(content, postId, user);
        if (result) {
            return {
                id: result._id.toString(),
                content: result.content,
                userId: result.userId,
                userLogin: result.userLogin,
                createdAt: result.createdAt
            };
        } else {
            return null;
        }
    },

    async changeComment(id: string, content: string): Promise<boolean> {
        return commentsRepository.changeComment(id, content);
    },

    async deleteComment(id: string): Promise<boolean> {
        return commentsRepository.deleteComment(id);
    }
}