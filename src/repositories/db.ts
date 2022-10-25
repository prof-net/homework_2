import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.mongoURI || "mongodb://localhost:27017";

console.log(mongoUri)
console.log(process.env["mongoURI"])

export const client = new MongoClient(mongoUri);

export const runDb = async () => {
    try {
        await client.connect();
        await client.db("social-network").command({ping: 1});
    } catch {
        await client.close();
    }
}