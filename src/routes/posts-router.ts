import {Router, Request, Response} from "express";
import {PostType} from "../types/post-type";
import {authorizationMiddleware} from "../validation/auth-validation";
import {
    postBlogIdValidation,
    postContentValidation,
    postDescValidation,
    postIdValidation,
    postTitleValidation
} from "../validation/posts-validation";
import {inputValidationMiddleware} from "../validation/blogs-validation";

const postValidators = [
    authorizationMiddleware,
    postTitleValidation,
    postDescValidation,
    postContentValidation,
    postBlogIdValidation,
    inputValidationMiddleware
]

export const postsRouter = Router({})
const posts: PostType[] = []
postsRouter.post('/',
    ...postValidators,
    (req: Request, res: Response) => {
        let newPost: PostType = {
            id: String(Date.now()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: 'string'
        }

        posts.push(newPost)
        res.status(201).send(newPost)

    })

postsRouter.put('/:id',
    ...postValidators,
    (req: Request, res: Response) => {
        console.log(req.headers, 'req.headers')
        let postToUpdate = posts.find(b => b.id === req.params.id)
        if (!postToUpdate) {
            res.sendStatus(404)
            return
        } else {
            posts.forEach(b => {
                if (b.id === req.params.id) {
                    b.title = req.body.title
                    b.shortDescription = req.body.shortDescription
                    b.content = req.body.content
                    b.blogId = req.body.blogId
                    res.sendStatus(204)
                    return
                }

            })

        }
    })

postsRouter.get('/',
    (req: Request, res: Response) => {
        res.status(200).send(posts)
    })
postsRouter.get('/:id',
    postIdValidation,
    (req: Request, res: Response) => {
        let findedPost = posts.filter(b => b.id === req.params.id)[0]
        if (findedPost) {
            res.status(200).send(findedPost)
        } else {
            res.sendStatus(404)
        }
    }
)

postsRouter.delete('/:id',
    authorizationMiddleware,
    postIdValidation,
    (req: Request, res: Response) => {
        let postToDeleteIndex = posts.findIndex(b => b.id === req.params.id)
        if (postToDeleteIndex > -1) {
            posts.splice(postToDeleteIndex, 1)
            res.sendStatus(204)
            return;
        } else {
            res.sendStatus(404)
            return
        }
    })