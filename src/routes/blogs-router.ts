import {Request, Response, Router} from "express";
import {
    blogDescValidation, blogIdValidation, blogNameValidation,
    blogWebUrlValidation, blogWebUrlValidation2, inputValidationMiddleware
} from "../validation/blogs-validation";
import {authorizationMiddleware} from "../validation/auth-validation";
import {BlogType} from "../types/blog-type";
import {client} from "../repositories/db";
// import {ObjectId} from "mongodb";
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
        // const blogs = await client.db('blogs').collection('blogs').find({})
        // const blogs =  await getData()
        // console.log(blogs,'blogs')
        // res.status(200).send([])
        try {
            await client.connect()
            const blogsCollection = await client.db('blogs').collection('blogs').find({}).toArray();

            res.status(200).send(blogsCollection)

        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.status(500).send('Ошибка при получении данных из коллекции');
        }

    })

blogsRouter.get('/:id', blogIdValidation, async (req: Request, res: Response) => {
        try {
            await client.connect()
            const responseBlog = await client.db('blogs').collection('blogs').findOne({_id: new ObjectId(req.params.id)})
            // console.log(responseBlog)
            if (responseBlog) {
                res.status(200).send(responseBlog)
            } else {
                res.sendStatus(404)
            }

        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(404)

        }

    }
)
blogsRouter.post('/',
    ...blogValidators,
    async (req: Request, res: Response) => {
        try {
            const newBlog: BlogType = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            }
            await client.connect()
            const responseBlog = await client.db('blogs').collection('blogs').insertOne(newBlog)
            blogs.push(newBlog)
            res.status(201).send(newBlog)

        } catch (error) {
            console.error('Ошибка при добавлении данных в коллекцию:', error);
            res.status(500).send('Ошибка при добавлении данных в коллекцию');

        }


    })

blogsRouter.put('/:id',
    ...blogValidators,
    (req: Request, res: Response) => {
        console.log(req.headers, 'req.headers')
        let findBlogToUpdate = blogs.find(b => String(b._id) === req.params.id)
        if (!findBlogToUpdate) {
            res.sendStatus(404)
            return
        } else {
            blogs.forEach(b => {
                if (String(b._id) === req.params.id) {
                    b.name = req.body.name
                    b.description = req.body.description
                    b.websiteUrl = req.body.websiteUrl
                }

            })
            res.sendStatus(204)
            return
        }
    })

blogsRouter.delete('/:id',
    authorizationMiddleware,
    blogIdValidation,
    (req: Request, res: Response) => {
        let findBlogToDeleteIndex = blogs.findIndex(b => String(b._id) === req.params.id)
        if (findBlogToDeleteIndex > -1) {
            blogs.splice(findBlogToDeleteIndex, 1)
            res.sendStatus(204)
            return;
        } else {
            res.sendStatus(404)
            return
        }
    })