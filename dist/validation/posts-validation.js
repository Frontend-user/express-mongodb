"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdValidation = exports.postBlogIdValidation = exports.postContentValidation = exports.postDescValidation = exports.postTitleValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_router_1 = require("../routes/blogs-router");
exports.postTitleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 4, max: 30 }).withMessage({
    message: 'title is wrong',
    field: 'title'
});
exports.postDescValidation = (0, express_validator_1.body)('shortDescription').trim().isLength({ min: 4, max: 100 }).withMessage({
    message: 'shortDescription is wrong',
    field: 'shortDescription'
});
exports.postContentValidation = (0, express_validator_1.body)('content').trim().isLength({ min: 4, max: 1000 }).withMessage({
    message: 'content is wrong',
    field: 'content'
});
exports.postBlogIdValidation = (0, express_validator_1.body)('blogId').trim().isLength({ min: 1, max: 300 }).isString().custom((value, { req }) => {
    let validIds = [];
    for (const blog of blogs_router_1.blogs) {
        validIds.push(blog.id);
    }
    if (!validIds.includes(value)) {
        throw new Error('blogId is wrong');
    }
    return true;
}).withMessage({
    message: 'blogId is wrong',
    field: 'blogId'
});
exports.postIdValidation = (0, express_validator_1.body)('id').trim().isLength({ min: 1, max: 300 }).isString().withMessage({
    message: 'id is wrong',
    field: 'id'
});
