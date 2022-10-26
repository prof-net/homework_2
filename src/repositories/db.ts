import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv";
import {IPostMongo} from "./posts-repository-mongo";
import {IBlogMongo} from "./blogs-repository-mongo";
dotenv.config();

const mongoUri = process.env.mongoURI || "mongodb://localhost:27017";

export const client = new MongoClient(mongoUri);
export const connectDbBlogs = client.db("social-network").collection<IBlogMongo>("blogs");
export const connectDbPosts = client.db("social-network").collection<IPostMongo>("posts");

export const runDb = async () => {
    try {
        await client.connect();
        await client.db("social-network").command({ping: 1});
    } catch {
        await client.close();
    }
}