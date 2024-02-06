import {body, check, validationResult, ValidationError} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {ErrorType} from "../types/error-type";
import {blogs} from "../routes/blogs-router";
import {blogsRepositories} from "../repositories/blogs-repositories";
import {ObjectId} from "mongodb";
import {PostViewType} from "../types/post-type";

export const postTitleValidation = body('title').trim().isLength({min: 4, max: 30}).withMessage({
    message: 'title is wrong',
    field: 'title'
})
export const postDescValidation = body('shortDescription').trim().isLength({min: 4, max: 100}).withMessage({
    message: 'shortDescription is wrong',
    field: 'shortDescription'
})


export const postContentValidation = body('content').trim().isLength({min: 4, max: 1000}).withMessage({
    message: 'content is wrong',
    field: 'content'
})

// export const postBlogIdValidation = body('blogId').trim().isLength({min: 1, max: 300}).isString().custom((value, {req})=>{
//     let validIds = []
//     for(const blog of blogs){
//         validIds.push(blog.id)
//     }
//     if(!validIds.includes(value)){
//         throw new Error('blogId is wrong');
//     }
//     return true;
// }).withMessage({
//     message: 'blogId is wrong',
//     field: 'blogId'
// })
export const postBlogIdValidation = body('blogId').trim().isLength({min: 1, max: 300}).withMessage({
    message: 'id is wrong',
    field: 'id'
})

export const postBlogIdExistValidation = body('blogId').custom(async (value, {req}) => {
    const blogs: PostViewType[] = await blogsRepositories.getBlogs()
    const isExistBlogId: PostViewType | undefined = blogs.find(b => String(b.id) === value)
    console.log(blogs, 'blogs :1')
    console.log(isExistBlogId, 'isExistBlogId :1')
    console.log(blogs[0].id, 'blogs[0]._id')
    console.log(value, 'value')
    if (isExistBlogId) {
        return true
    } else {
        throw new Error('BLOGID WRONG');
    }
}).withMessage({
    message: 'BLOGID WRON',
    field: 'blogId'
})


// export const postBlogIdExistValidation = async (res: Response, req: Request, next: NextFunction) => {
//     let blogId = req.body.blogId
//     let blogs = await blogsRepositories.getBlogs()
//     let isExistBlogId = blogs.find(b=>b.id===blogId)
//     if(isExistBlogId){
//         next()
//     }else {
//
//     }
// }
export const postIdValidation = body('id').trim().isLength({min: 1, max: 300}).isString().withMessage({
    message: 'id is wrong',
    field: 'id'
})