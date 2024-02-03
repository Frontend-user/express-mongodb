"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const auth_validation_1 = require("../validation/auth-validation");
const posts_validation_1 = require("../validation/posts-validation");
const blogs_validation_1 = require("../validation/blogs-validation");
const postValidators = [
    auth_validation_1.authorizationMiddleware,
    posts_validation_1.postTitleValidation,
    posts_validation_1.postDescValidation,
    posts_validation_1.postContentValidation,
    posts_validation_1.postBlogIdValidation,
    blogs_validation_1.inputValidationMiddleware
];
exports.postsRouter = (0, express_1.Router)({});
const posts = [];
exports.postsRouter.post('/', ...postValidators, (req, res) => {
    let newPost = {
        id: String(Date.now()),
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: 'string'
    };
    posts.push(newPost);
    res.status(201).send(newPost);
});
exports.postsRouter.put('/:id', ...postValidators, (req, res) => {
    console.log(req.headers, 'req.headers');
    let postToUpdate = posts.find(b => b.id === req.params.id);
    if (!postToUpdate) {
        res.sendStatus(404);
        return;
    }
    else {
        posts.forEach(b => {
            if (b.id === req.params.id) {
                b.title = req.body.title;
                b.shortDescription = req.body.shortDescription;
                b.content = req.body.content;
                b.blogId = req.body.blogId;
                res.sendStatus(204);
                return;
            }
        });
    }
});
exports.postsRouter.get('/', (req, res) => {
    res.status(200).send(posts);
});
exports.postsRouter.get('/:id', posts_validation_1.postIdValidation, (req, res) => {
    let findedPost = posts.filter(b => b.id === req.params.id)[0];
    if (findedPost) {
        res.status(200).send(findedPost);
    }
    else {
        res.sendStatus(404);
    }
});
exports.postsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, posts_validation_1.postIdValidation, (req, res) => {
    let postToDeleteIndex = posts.findIndex(b => b.id === req.params.id);
    if (postToDeleteIndex > -1) {
        posts.splice(postToDeleteIndex, 1);
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
