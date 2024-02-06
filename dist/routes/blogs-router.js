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
exports.blogsRouter = exports.blogs = void 0;
const express_1 = require("express");
const blogs_validation_1 = require("../validation/blogs-validation");
const auth_validation_1 = require("../validation/auth-validation");
const blogs_repositories_1 = require("../repositories/blogs-repositories");
const http_statuses_1 = require("../constants/http-statuses");
const mongodb_1 = require("mongodb");
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
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blogs_repositories_1.blogsRepositories.getBlogs();
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blogs);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.status(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.blogsRouter.get('/:id', blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_repositories_1.blogsRepositories.getBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blog);
}));
exports.blogsRouter.post('/', ...blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBlog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const response = yield blogs_repositories_1.blogsRepositories.createBlog(newBlog);
        if (response) {
            const createdBlog = yield blogs_repositories_1.blogsRepositories.getBlogById(response);
            res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdBlog);
            return;
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.blogsRouter.put('/:id', ...blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let blogDataToUpdate = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    };
    try {
        const response = yield blogs_repositories_1.blogsRepositories.updateBlog(new mongodb_1.ObjectId(req.params.id), blogDataToUpdate);
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.blogsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield blogs_repositories_1.blogsRepositories.deleteBlog(new mongodb_1.ObjectId(req.params.id));
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
