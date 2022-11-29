import * as dotenv from "dotenv";

dotenv.config();

export const setting = {
    mongoURI: process.env.mongoURI || "mongodb://localhost:27017",
    JWT_SECRET: process.env.JWT_SECRET || "accessToken",
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET || "refreshToken",
    PORT: process.env.PORT || 3000
}