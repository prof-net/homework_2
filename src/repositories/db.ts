import { MongoClient } from 'mongodb';
import {IPostMongo} from "../types/typesPosts";
import {IBlogMongo} from "../types/typesBlogs";
import {IUserMongo} from "../types/typesUsers";
import {ICommentMongo} from "../types/typesComments";
import {setting} from "../settings/settings";

const mongoUri = setting.mongoURI;

export const client = new MongoClient(mongoUri);
export const connectDbBlogs = client.db("social-network").collection<IBlogMongo>("blogs");
export const connectDbPosts = client.db("social-network").collection<IPostMongo>("posts");
export const connectDbUsers = client.db("social-network").collection<IUserMongo>("users");
export const connectDbComments = client.db("social-network").collection<ICommentMongo>("comments");

export const runDb = async () => {
    try {
        await client.connect();
        await client.db("social-network").command({ping: 1});
    } catch {
        await client.close();
    }
}