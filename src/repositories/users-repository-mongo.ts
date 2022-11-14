import {connectDbUsers} from "./db";
import {ObjectId} from "mongodb";
import {IUserMongo} from "../types/typesUsers";

export const usersRepository = {
    async createUser(login: string, password: string, email: string): Promise<IUserMongo | null> {
        const result = await connectDbUsers.insertOne({
            _id: new ObjectId(),
            login,
            password,
            email,
        });
        return await connectDbUsers.findOne({_id: result.insertedId});
    },

    async deleteUser(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbUsers.deleteOne({_id: new ObjectId(id)});
        return Boolean(result.deletedCount);
    }
}