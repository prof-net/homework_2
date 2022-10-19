interface IBlog {
    id: string;
    name: string;
    youtubeUrl: string;
}

let blogs: IBlog[] = [];

export const blogsRepository = {
    getAllBlogs():IBlog[] {
        return blogs;
    },

    createBlog(name: string, youtubeUrl:string):IBlog {
        const newBlog = {
            id: (+new Date()).toString(),
            name: name,
            youtubeUrl: youtubeUrl,
        }
        blogs.push(newBlog)
        return newBlog;
    },

    getSingleBlog(id: string):IBlog | undefined {
        return blogs.find(item => id === item.id);
    },

    changeBlog(id: string, name: string, youtubeUrl: string):boolean {
        const blog = blogs.find(item => id === item.id);
        blogs = blogs.map(item => {
            if (id === item.id && blog) return {
                id,
                name,
                youtubeUrl
            };
            return item;
        })
        return Boolean(blog);
    },

    deleteBlog(id: string):boolean {
        if (!blogs.find(item => item.id === id)) {
            return false;
        }
        blogs = blogs.filter(item => item.id !== id);
        return true;
    },

    getBlogs(): IBlog[] {
        return blogs
    },

    setBlogs(newBlogs: IBlog[]): void {
        blogs = newBlogs;
    }

}