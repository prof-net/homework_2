import express from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser());
app.use('/api', blogsRouter);
app.use('/api', postsRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})