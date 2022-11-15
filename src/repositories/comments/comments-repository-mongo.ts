import {connectDbComments, connectDbPosts} from "../db";
import {ObjectId} from "mongodb";
import {ICommentMongo} from "../../types/typesComments";
import {IUser} from "../../types/typesUsers";

export const commentsRepository = {
    async createComment(content: string, postId: string, user: IUser): Promise<ICommentMongo | null> {
        if (!ObjectId.isValid(postId)) {
            return null;
        }
        const post = await connectDbPosts.findOne({_id: new ObjectId(postId)});
        if (!post) {
            return null;
        }
        const result = await connectDbComments.insertOne({
            _id: new ObjectId(),
            content,
            postId: post._id,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date().toISOString()
        });
        return await connectDbComments.findOne({_id: result.insertedId});
    },

    async changeComment(id: string, content: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbComments.updateOne(
            {_id: new ObjectId(id)},
            {$set: {content}})
        return Boolean(result.modifiedCount);
    },

    async deleteComment(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbComments.deleteOne({_id: new ObjectId(id)});
        return Boolean(result.deletedCount);
    },
}