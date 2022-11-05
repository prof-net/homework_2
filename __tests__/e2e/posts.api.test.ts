import request from 'supertest';
import {app} from "../../src";

describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/api/testing/all-data')
    });
});