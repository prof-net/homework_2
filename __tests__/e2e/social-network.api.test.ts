import request from 'supertest';
import {app} from "../../src";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/api/testing/all-data')
    });

    it('should return 200 and arr', async () => {
        await request(app)
            .get('/api/blogs')
            .expect(200, [])
    });

    it('should return 404 for not exist blog', async () => {
        await request(app)
            .get('/api/blogs/1')
            .expect(404)
    });

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
});