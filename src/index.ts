import express, {Request, Response} from 'express';
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {connectDbBlogs, connectDbPosts, connectDbUsers, runDb} from "./repositories/db";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/testing/all-data', async (req: Request, res: Response) => {
    await connectDbBlogs.deleteMany({});
    await connectDbPosts.deleteMany({});
    await connectDbUsers.deleteMany({});
    return res.sendStatus(204);
});
app.use('/api', blogsRouter);
app.use('/api', postsRouter);
app.use('/api', usersRouter);
app.use('/api', authRouter);


const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

startApp();

