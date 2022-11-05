import request from 'supertest';
import {app} from "../../src";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/api/testing/all-data')
    });

    // get all blogs
    it('should return 200 and empty arr', async () => {
        const getResponse = await request(app)
            .get('/api/blogs')
            .expect(200);

        const getBlogs = getResponse.body;
        expect(getBlogs).toEqual({
            pagesCount: expect.any(Number),
            page: expect.any(Number),
            pageSize: expect.any(Number),
            totalCount: expect.any(Number),
            items: []
        });
    });

    // get single blogs
    it('should return 404 for not exist blog', async () => {
        await request(app)
            .get('/api/blogs/1')
            .expect(404)
    });

    it(`should return single correct blog`, async () => {
        const createResponse = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                name: "test",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(201);
        const createBlog = createResponse.body;

        const getSingleResponseBlog = await request(app)
            .get(`/api/blogs/${createBlog.id}`)
            .expect(200)
        const getSingleBlog = getSingleResponseBlog.body;

        expect(getSingleBlog).toEqual({
            id: expect.any(String),
            name: "test",
            youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8",
            createdAt: expect.any(String)
        });
    })


    // get create blog
    it(`should'nt create blog with incorrect input data`, async () => {
        await request(app)
            .post('/api/blogs',)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                name: "",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(400, {
                errorsMessages: [
                    {
                        message: "Name should be less 15 symbols",
                        field: "name"
                    }
                ]
            })
    });

    it(`should'nt create blog with incorrect Authorization`, async () => {
        await request(app)
            .post('/api/blogs',)
            .send({
                name: "",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(401)
    });

    it(`should create blog with correct input data`, async () => {
        const createResponse = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                name: "test",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(201);
        const createBlog = createResponse.body;
        expect(createBlog).toEqual({
            id: expect.any(String),
            name: "test",
            youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8",
            createdAt: expect.any(String)
        });
    })

    // get create post for blog
    it(`should create post for blog with correct input data`, async () => {
        const createBlogResponseForPost = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                name: "test",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(201);
        const createBlogForPost = createBlogResponseForPost.body;

        const createPostResponse = await request(app)
            .post(`/api/blogs/${createBlogForPost.id}/posts`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                title: "string",
                shortDescription: "string",
                content: "string"
            })
            .expect(201);
        const createPost = createPostResponse.body;

        expect(createPost).toEqual({
            id: expect.any(String),
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: createBlogForPost.id,
            blogName: createBlogForPost.name,
            createdAt: expect.any(String)
        });
    })

    it(`should create post for blog with incorrect data`, async () => {
        const createBlogResponseForPost = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                name: "test",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(201);
        const createBlogForPost = createBlogResponseForPost.body;

        await request(app)
            .post(`/api/blogs/${createBlogForPost.id}/posts`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                shortDescription: "string",
                content: "string"
            })
            .expect(400);
    })

    it(`should create post for blog with incorrect Authorization`, async () => {
        const createBlogResponseForPost = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                title: "string",
                name: "test",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(201);
        const createBlogForPost = createBlogResponseForPost.body;

        await request(app)
            .post(`/api/blogs/${createBlogForPost.id}/posts`)
            .send({
                title: "string",
                shortDescription: "string",
                content: "string"
            })
            .expect(401);
    })

    it(`should create post for blog with incorrect blog ID`, async () => {
        await request(app)
            .post('/api/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                name: "test",
                youtubeUrl: "https://www.youtube.com/watch?v=LlGNXFcRfZ8"
            })
            .expect(201);

        await request(app)
            .post(`/api/blogs/111/posts`)
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send({
                title: "string",
                shortDescription: "string",
                content: "string"
            })
            .expect(404);
    })
});