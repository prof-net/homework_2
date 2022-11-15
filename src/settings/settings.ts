import * as dotenv from "dotenv";

dotenv.config();

export const setting = {
    mongoURI: process.env.mongoURI || "mongodb://localhost:27017",
    JWT_SECRET: process.env.JWT_SECRET || "123",
    PORT: process.env.PORT || 3000
}