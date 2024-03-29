import {Router, Request, Response} from "express";
import {PostCreateType, PostViewType} from "../types/post-type";
import {authorizationMiddleware} from "../validation/auth-validation";
import {
    postBlogIdExistValidation,
    postBlogIdValidation,
    postContentValidation,
    postDescValidation,
    postIdValidation,
    postTitleValidation
} from "../validation/posts-validation";
import {inputValidationMiddleware} from "../validation/blogs-validation";
import {postsRepositories} from "../repositories/posts-repositories";
import {HTTP_STATUSES} from "../constants/http-statuses";
import {ObjectId} from "mongodb";

const postValidators = [
    authorizationMiddleware,
    postTitleValidation,
    postDescValidation,
    postContentValidation,
    postBlogIdValidation,
    postBlogIdExistValidation,
    inputValidationMiddleware
]

export const postsRouter = Router({})


postsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const posts = await postsRepositories.getPosts()
            res.status(HTTP_STATUSES.OK_200).send(posts)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.status(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


postsRouter.get('/:id',
    postIdValidation,
    async (req: Request, res: Response) => {
        try {
            const post = await postsRepositories.getPostById(req.params.id)
            if (!post) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.status(HTTP_STATUSES.OK_200).send(post)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
)

postsRouter.post('/',
    ...postValidators,
    async (req: Request, res: Response) => {
        let newPost: PostCreateType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: 'string',
            createdAt: new Date().toISOString()
        }

        try {
            const response = await postsRepositories.createPost(newPost)
            if (response instanceof ObjectId) {
                const createdPost: PostViewType | boolean = await postsRepositories.getPostById(response)
                res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
                return
            }
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }


    })

postsRouter.put('/:id',
    ...postValidators,
    async (req: Request, res: Response) => {
        let postDataToUpdate = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        try {
            const response: boolean = await postsRepositories.updatePost(new ObjectId(req.params.id), postDataToUpdate)
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })


postsRouter.delete('/:id',
    authorizationMiddleware,
    postIdValidation,
    async (req: Request, res: Response) => {
        try {
            const response: boolean = await postsRepositories.deletePost(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })