import {ObjectId} from "mongodb";

export interface IBlogMongo  {
    _id: ObjectId;
    name: string;
    websiteUrl: string;
    description: string;
    createdAt: string;
}

export interface IBlog {
    id: string;
    name: string;
    websiteUrl: string;
    description: string;
    createdAt: string;
}

export interface IBlogSort {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IBlog[];
}

export interface IQueryBlog {
    searchNameTerm?: string;
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: string;
}

export interface IBlogBody {
    name: string;
    websiteUrl: string;
    description: string;
}