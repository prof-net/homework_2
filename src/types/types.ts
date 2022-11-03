import {ObjectId} from "mongodb";

export interface IBlogMongo  {
    _id: ObjectId;
    name: string;
    youtubeUrl: string;
    createdAt: string;
}

export interface IBlog {
    id: string;
    name: string;
    youtubeUrl: string;
    createdAt: string;
}

export interface IPost {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

export interface IPostMongo {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string
}