import {app} from "../../src/app";
import {describe} from "node:test";
import {blogsRouter} from "../../src/routes/blogs-router";

const request = require('supertest')

describe('/blogs', () => {

const token = 'Basic YWRtaW46cXdlcnR5'

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('[GET BLOGS] [EXPECT 200 [] ]IS DELETE? should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('[GET BLOG] [NOT EXISTING]should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(404)
    })

    it('[AUTH INCORRECT] should return 401 for false Authorization data', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', 'dasdadsadsadsa')
            .expect(401)
    })


    it('[CREATE BLOG] [INCORRECT] should return 400 for incorrect data to ', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', `${token}`)
            .send({
                "name": "",
                "description": "",
                "websiteUrl": "e4"
            })
            .expect(400)
    })

    it('[CREATE BLOG] [CORRECT DATA] should return 201 for create new blog', async () => {
        const createResponse = await request(app)

            .post('/blogs')
            .set('Authorization', `${token}`)
            .send({
                "name": "name",
                "description": "description",
                "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
            })
        const createBlog = createResponse.body
            expect(createBlog).toEqual({
                _id: expect.any(String),
                name: "name",
                description: "description",
                websiteUrl: "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4",
                createdAt:expect.any(String),
                isMembership: expect.any(Boolean)
            })

        await request(app)
            .get('/blogs')
            .expect(200,[createBlog])


        it('[GET BLOG] [EXISTING]should return 201 for  existing blog', async () => {
            await request(app)
                .get(`/blogs/${createBlog._id}`)
                .expect(200,[createBlog])
        })

    })


    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })



})