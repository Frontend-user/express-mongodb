"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = exports.blogs = void 0;
const express_1 = require("express");
const blogs_validation_1 = require("../validation/blogs-validation");
const auth_validation_1 = require("../validation/auth-validation");
const blogValidators = [
    auth_validation_1.authorizationMiddleware,
    blogs_validation_1.blogDescValidation,
    blogs_validation_1.blogNameValidation,
    blogs_validation_1.blogWebUrlValidation,
    blogs_validation_1.blogWebUrlValidation2,
    blogs_validation_1.inputValidationMiddleware,
];
exports.blogs = [];
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    res.status(200).send(exports.blogs);
});
exports.blogsRouter.get('/:id', blogs_validation_1.blogIdValidation, (req, res) => {
    let findBlog = exports.blogs.find(b => b.id === req.params.id);
    if (findBlog) {
        res.status(200).send(findBlog);
    }
    else {
        res.sendStatus(404);
    }
});
exports.blogsRouter.post('/', ...blogValidators, (req, res) => {
    const newBlog = {
        id: String(Date.now()),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    };
    exports.blogs.push(newBlog);
    res.status(201).send(newBlog);
});
exports.blogsRouter.put('/:id', ...blogValidators, (req, res) => {
    console.log(req.headers, 'req.headers');
    let findBlogToUpdate = exports.blogs.find(b => b.id === req.params.id);
    if (!findBlogToUpdate) {
        res.sendStatus(404);
        return;
    }
    else {
        exports.blogs.forEach(b => {
            if (b.id === req.params.id) {
                b.name = req.body.name;
                b.description = req.body.description;
                b.websiteUrl = req.body.websiteUrl;
            }
        });
        res.sendStatus(204);
        return;
    }
});
exports.blogsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, blogs_validation_1.blogIdValidation, (req, res) => {
    let findBlogToDeleteIndex = exports.blogs.findIndex(b => b.id === req.params.id);
    if (findBlogToDeleteIndex > -1) {
        exports.blogs.splice(findBlogToDeleteIndex, 1);
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
