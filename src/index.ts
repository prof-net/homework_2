import express, {Request, Response} from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {blogsRepository} from "./repositories/blogs-repository";
import {postsRepository} from "./repositories/posts-repository";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser());
app.use('/api', blogsRouter);
app.use('/api', postsRouter);
app.use('/api/testing/all-data', (req: Request, res: Response) => {
    postsRepository.setPosts([]);
    blogsRepository.setBlogs([]);
    return res.send(204);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})