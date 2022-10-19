import {blogsRepository} from "./blogs-repository";

interface IPost {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}

let posts: IPost[] = [];

export const postsRepository = {
    getAllPosts() {
        return posts;
    },

    createPost(title: string, shortDescription: string, content: string, blogId: string):IPost | undefined {
        const blogName = blogsRepository.getBlogs().find(blog => blog.id === blogId)
        if (blogName) {
            const newPost = {
                id: (+new Date()).toString(),
                title,
                shortDescription,
                content,
                blogId,
                blogName: blogName.name
            }
            posts.push(newPost)
            return newPost;
        } else {
            return undefined;
        }
    },

    getSinglePost(id: string):IPost | undefined {
        return posts.find(item => id === item.id);
    },

    changePost(id: string, title: string, shortDescription: string, content: string, blogId: string):boolean {
        const post = posts.find(item => id === item.id);
        const blog = blogsRepository.getBlogs().find(item => blogId === item.id);
        if (!blog) {
            return false;
        }
        posts = posts.map(item => {
            if (id === item.id && post) return {
                id,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name
            };
            return item;
        })
        return Boolean(post);
    },

    deletePost(id: string):boolean {
        if (!posts.find(item => item.id === id)) {
            return false;
        }
        posts = posts.filter(item => item.id !== id);
        return true
    },

    getPosts(): IPost[] {
        return posts;
    },

    setPosts(newPosts: IPost[]):void {
        posts = newPosts;
    }
}