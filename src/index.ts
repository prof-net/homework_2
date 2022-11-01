import express, {Request, Response} from 'express';
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {connectDbBlogs, connectDbPosts, runDb} from "./repositories/db";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', blogsRouter);
app.use('/api', postsRouter);
app.use('/api/testing/all-data', async (req: Request, res: Response) => {
    await connectDbBlogs.deleteMany({});
    await connectDbPosts.deleteMany({});
    return res.send(204);
});

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

startApp();

