import {Request, Response, Router} from "express";
import {
    blogDescValidation, blogIdValidation, blogNameValidation,
    blogWebUrlValidation, blogWebUrlValidation2, inputValidationMiddleware
} from "../validation/blogs-validation";
import {authorizationMiddleware} from "../validation/auth-validation";
import {BlogType} from "../types/blog-type";

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
    (req: Request, res: Response) => {
        res.status(200).send(blogs)
    })

blogsRouter.get('/:id',
    blogIdValidation,
    (req: Request, res: Response) => {
        let findBlog = blogs.find(b => b.id === req.params.id)
        if (findBlog) {
            res.status(200).send(findBlog)
        } else {
            res.sendStatus(404)
        }
    }
)
blogsRouter.post('/',
    ...blogValidators,
    (req: Request, res: Response) => {

        const newBlog: BlogType = {
            id: String(Date.now()),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }

        blogs.push(newBlog)
        res.status(201).send(newBlog)

    })

blogsRouter.put('/:id',
    ...blogValidators,
    (req: Request, res: Response) => {
        console.log(req.headers, 'req.headers')
        let findBlogToUpdate = blogs.find(b => b.id === req.params.id)
        if (!findBlogToUpdate) {
            res.sendStatus(404)
            return
        } else {
            blogs.forEach(b => {
                if (b.id === req.params.id) {
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
        let findBlogToDeleteIndex = blogs.findIndex(b => b.id === req.params.id)
        if (findBlogToDeleteIndex > -1) {
            blogs.splice(findBlogToDeleteIndex, 1)
            res.sendStatus(204)
            return;
        } else {
            res.sendStatus(404)
            return
        }
    })