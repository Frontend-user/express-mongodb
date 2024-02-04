import {body, check, validationResult, ValidationError} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {ErrorType} from "../types/error-type";
import {blogs} from "../routes/blogs-router";

export const postTitleValidation = body('title').trim().isLength({min: 4, max: 30}).withMessage({
    message: 'title is wrong',
    field: 'title'
})
export  const postDescValidation = body('shortDescription').trim().isLength({min: 4, max: 100}).withMessage({
    message: 'shortDescription is wrong',
    field: 'shortDescription'
})


export  const postContentValidation = body('content').trim().isLength({min: 4, max: 1000}).withMessage({
    message: 'content is wrong',
    field: 'content'
})

export const postBlogIdValidation = body('blogId').trim().isLength({min: 1, max: 300}).isString().custom((value, {req})=>{
    let validIds = []
    for(const blog of blogs){
        validIds.push(blog._id)
    }
    if(!validIds.includes(value)){
        throw new Error('blogId is wrong');
    }
    return true;
}).withMessage({
    message: 'blogId is wrong',
    field: 'blogId'
})
export const postIdValidation = body('id').trim().isLength({min: 1, max: 300}).isString().withMessage({
    message: 'id is wrong',
    field: 'id'
})