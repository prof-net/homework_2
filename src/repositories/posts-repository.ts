interface IPost {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}

const posts: IPost[] = [{
    id: "1",
    title: "title",
    shortDescription: "string",
    content: "string",
    blogId: "1",
    blogName: 'blogName'
}];

export const postsRepository = {
    getAllPosts() {
        return posts;
    }
}