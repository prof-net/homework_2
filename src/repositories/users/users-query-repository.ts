import {connectDbUsers} from "../db";
import {IQueryUser, IUser, IUserMongo, IUserPass, IUserSort} from "../../types/typesUsers";

export const usersQueryRepository = {
    async getAllUsers(query: IQueryUser): Promise<IUserSort> {
        const pageNumber: number = Number(query.pageNumber) || 1;
        const pageSize: number = Number(query.pageSize) || 10;
        const sortBy: string = query.sortBy || 'createdAt';
        const sortDirection: 'asc' | 'desc' = query.sortDirection === 'asc' ? 'asc' : 'desc';
        const searchLoginTerm = query.searchLoginTerm ? {login: {'$regex': query.searchLoginTerm, $options: 'i'}} : {};
        const searchEmailTerm = query.searchEmailTerm ? {email: {'$regex': query.searchEmailTerm, $options: 'i'}} : {};
        const totalCount = await connectDbUsers.count({$or: [searchEmailTerm, searchLoginTerm]});
        const pagesCount = Math.ceil(totalCount / pageSize);

        const result = await connectDbUsers.find({$or: [searchEmailTerm, searchLoginTerm]}).skip((pageNumber - 1) * pageSize).limit(pageSize).sort(sortBy, sortDirection).toArray();

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: result.map(item => {
                return {
                    id: item._id.toString(),
                    login: item.login,
                    email: item.email,
                    createdAt: item.createdAt,
                }
            })
        }
    },

    async getOneUserPassForLogin(login: string): Promise<IUserPass | null> {
        const result = await connectDbUsers.findOne({login});

        if (!result) {
            return null
        }

        return {
            id: result._id.toString(),
            login: result.login,
            email: result.email,
            passwordHash: result.passwordHash,
            passwordSalt: result.passwordSalt
        }
    },

    async getOneUserByConfirmationCode(code:string):Promise<IUserMongo | null> {
        return await connectDbUsers.findOne({"emailConfirmation.confirmation": code});
    },

    async getOneUserByEmail(email:string):Promise<IUserMongo | null> {
        return await connectDbUsers.findOne({email});
    },

    async getOneUserForLogin(login: string): Promise<IUser | null> {
        const result = await connectDbUsers.findOne({login});

        if (!result) {
            return null
        }

        return {
            id: result._id.toString(),
            login: result.login,
            email: result.email,
            createdAt: result.createdAt
        }
    }
}