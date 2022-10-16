interface IBlog {
    id: string;
    name: string;
    youtubeUrl: string;
}

const blogs: IBlog[] = [];

export const blogsRepository = {
    getAllBlogs() {
        return blogs;
    }
}