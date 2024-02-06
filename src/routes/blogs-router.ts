import {raw, Request, Response, Router} from "express";
import {
    blogDescValidation, blogIdValidation, blogNameValidation,
    blogWebUrlValidation, blogWebUrlValidation2, inputValidationMiddleware
} from "../validation/blogs-validation";
import {authorizationMiddleware} from "../validation/auth-validation";
import {BlogCreateType, BlogUpdateType, BlogViewType} from "../types/blog-type";
import {blogsRepositories} from "../repositories/blogs-repositories";
import {HTTP_STATUSES} from "../constants/http-statuses";

const {ObjectId} = require('mongodb');
const blogValidators = [
    authorizationMiddleware,
    blogDescValidation,
    blogNameValidation,
    blogWebUrlValidation,
    blogWebUrlValidation2,
    inputValidationMiddleware,
]
export const blogs: BlogViewType[] = []
export const blogsRouter = Router({})


blogsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const blogs = await blogsRepositories.getBlogs()
            res.status(HTTP_STATUSES.OK_200).send(blogs)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.status(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

blogsRouter.get('/:id', blogIdValidation, async (req: Request, res: Response) => {
        try {
            const blog = await blogsRepositories.getBlogById(req.params.id)
            if (!blog) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.status(HTTP_STATUSES.OK_200).send(blog)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
)


blogsRouter.post('/',
    ...blogValidators,
    async (req: Request, res: Response) => {
        try {
            const newBlog: BlogCreateType = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            }
            const respone = await blogsRepositories.createBlog(newBlog)
            console.log(typeof respone, 'type')
            if (!respone) {
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
                return
            } else if (typeof respone === 'object') {
                const createdBlog: BlogViewType | boolean = await blogsRepositories.getBlogById(respone)
                res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
            }


        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    })

blogsRouter.put('/:id',
    ...blogValidators,
    async (req: Request, res: Response) => {
        let blogDataToUpdate: BlogUpdateType = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
        }

        try {
            const respone: boolean = await blogsRepositories.updateBlog(new ObjectId(req.params.id), blogDataToUpdate)
            if (respone) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })


blogsRouter.delete('/:id',
    authorizationMiddleware,
    blogIdValidation,
    async (req: Request, res: Response) => {
        try {
            const response: boolean = await blogsRepositories.deleteBlog(new ObjectId(req.params.id))
            if (response) {
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return
            } else {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })


