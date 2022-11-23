import {connectDbUsers} from "../db";
import {ObjectId} from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import {IUserMongo} from "../../types/typesUsers";

export const usersRepository = {
    async createUser(login: string, passwordHash: string, passwordSalt:string, email: string): Promise<IUserMongo | null> {
        const result = await connectDbUsers.insertOne({
            _id: new ObjectId(),
            login,
            passwordHash,
            passwordSalt,
            email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmation: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }),
                isConfirmed: false
            }
        });
        return await connectDbUsers.findOne({_id: result.insertedId});
    },

    async updateConfirmation(id: ObjectId):Promise<boolean> {
        const result = await connectDbUsers.updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    },

    async updateResendingConfirmation(id: ObjectId):Promise<boolean> {
        const result = await connectDbUsers.updateOne({_id: id}, {$set: {'emailConfirmation.expirationDate': add(new Date(), {
                    hours: 1,
                    minutes: 3
                }), confirmation: uuidv4()}});
        return result.modifiedCount === 1;
    },

    async deleteUser(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        const result = await connectDbUsers.deleteOne({_id: new ObjectId(id)});
        return Boolean(result.deletedCount);
    }
}