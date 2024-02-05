import {raw, Request, Response, Router} from "express";
import {
    blogDescValidation, blogIdValidation, blogNameValidation,
    blogWebUrlValidation, blogWebUrlValidation2, inputValidationMiddleware
} from "../validation/blogs-validation";
import {authorizationMiddleware} from "../validation/auth-validation";
import {BlogType} from "../types/blog-type";
import {client} from "../repositories/db";
import {changeIdFormat, mongodbCreate, mongodbGetAll, mongodbGetById} from "../services/mongodb-custom-crud";

const {ObjectId} = require('mongodb');
const blogValidators = [
    authorizationMiddleware,
    blogDescValidation,
    blogNameValidation,
    blogWebUrlValidation,
    blogWebUrlValidation2,
    inputValidationMiddleware,
]
export const blogs: BlogType[] = []
export const blogsRouter = Router({})


blogsRouter.get('/',
    async (req: Request, res: Response) => {
        await mongodbGetAll(res, 'blogs', 'blogs')
        // try {
        //     await client.connect()
        //     const blogsCollection = await client.db('blogs').collection('blogs').find({}).toArray();
        //     const fixArrayIds = blogsCollection.map((item => changeIdFormat(item)))
        //     res.status(200).send(fixArrayIds)
        // } catch (error) {
        //     console.error('Ошибка при получении данных из коллекции:', error);
        //     res.status(500).send('Ошибка при получении данных из коллекции');
        // }

    })

blogsRouter.get('/:id', blogIdValidation, async (req: Request, res: Response) => {
        await mongodbGetById(res, 'blogs', 'blogs', req.params.id)
    }
)


blogsRouter.post('/',
    ...blogValidators,
    async (req: Request, res: Response) => {
        // try {
        const newBlog: BlogType = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        await mongodbCreate(res, 'blogs', 'blogs', newBlog)
        // await client.connect()
        // const response = await client.db('blogs').collection('blogs').insertOne(newBlog)
        // if (response.insertedId) {
        //     let createdBlog:BlogType = await client.db('blogs').collection('blogs')
        //         .findOne({ _id: response.insertedId }) as BlogType;
        //     if(createdBlog){
        //         let newBLog = changeIdFormat(createdBlog)
        //         res.status(201).send(newBLog)
        //     }
        //
        // } else {
        //     res.status(500).send('Ошибка при добавлении данных в коллекцию');
        // }
        // } catch (error) {
        //     console.error('Ошибка при добавлении данных в коллекцию:', error);
        //     res.status(500).send('Ошибка при добавлении данных в коллекцию');
        //
        // }


    })

blogsRouter.put('/:id',
    ...blogValidators,
    async (req: Request, res: Response) => {
        try {
            await client.connect()
            let result = await client.db('blogs').collection('blogs').updateOne({_id: new ObjectId(req.params.id)},
                {
                    $set: {
                        name: req.body.name,
                        description: req.body.description,
                        websiteUrl: req.body.websiteUrl,
                    }
                })
            if (result.matchedCount === 1) {
                res.sendStatus(204)
                return
            } else {
                res.sendStatus(404)
                return

            }
        } catch (error) {
            res.sendStatus(404)
        }
    })


blogsRouter.delete('/:id',
    authorizationMiddleware,
    blogIdValidation,
    async (req: Request, res: Response) => {
        try {
            await client.connect()
            const responseBlog = await client.db('blogs').collection('blogs').deleteOne({_id: new ObjectId(req.params.id)})
            console.log(responseBlog, 'responseBlog')
            if (responseBlog.deletedCount) {
                res.sendStatus(204)
                return
            } else {
                res.sendStatus(404)
                return
            }

        } catch (error) {
            res.sendStatus(404)
        }
        // }
    })


