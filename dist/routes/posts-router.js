"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const auth_validation_1 = require("../validation/auth-validation");
const posts_validation_1 = require("../validation/posts-validation");
const blogs_validation_1 = require("../validation/blogs-validation");
const posts_repositories_1 = require("../repositories/posts-repositories");
const http_statuses_1 = require("../constants/http-statuses");
const mongodb_1 = require("mongodb");
const postValidators = [
    auth_validation_1.authorizationMiddleware,
    posts_validation_1.postTitleValidation,
    posts_validation_1.postDescValidation,
    posts_validation_1.postContentValidation,
    posts_validation_1.postBlogIdValidation,
    posts_validation_1.postBlogIdExistValidation,
    blogs_validation_1.inputValidationMiddleware
];
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield posts_repositories_1.postsRepositories.getPosts();
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(posts);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.status(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.postsRouter.get('/:id', posts_validation_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield posts_repositories_1.postsRepositories.getPostById(req.params.id);
        if (!post) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(post);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.postsRouter.post('/', ...postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newPost = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: 'string',
        createdAt: new Date().toISOString(),
        isMembership: false
    };
    try {
        const respone = yield posts_repositories_1.postsRepositories.createPost(newPost);
        console.log(typeof respone, 'type');
        if (!respone) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        else if (typeof respone === 'object') {
            const createdPost = yield posts_repositories_1.postsRepositories.getPostById(respone);
            res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdPost);
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.postsRouter.put('/:id', ...postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let postDataToUpdate = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    };
    try {
        const respone = yield posts_repositories_1.postsRepositories.updatePost(new mongodb_1.ObjectId(req.params.id), postDataToUpdate);
        if (respone) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
            return;
        }
        else {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.postsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, posts_validation_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield posts_repositories_1.postsRepositories.deletePost(new mongodb_1.ObjectId(req.params.id));
        if (response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
            return;
        }
        else {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
