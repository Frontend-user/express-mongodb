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
const db_1 = require("../repositories/db");
// import {ObjectId} from "mongodb";
const { ObjectId } = require('mongodb');
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
    // const blogs = await client.db('blogs').collection('blogs').find({})
    // const blogs =  await getData()
    // console.log(blogs,'blogs')
    // res.status(200).send([])
    try {
        yield db_1.client.connect();
        const blogsCollection = yield db_1.client.db('blogs').collection('blogs').find({}).toArray();
        res.status(200).send(blogsCollection);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.status(500).send('Ошибка при получении данных из коллекции');
    }
}));
exports.blogsRouter.get('/:id', blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        const responseBlog = yield db_1.client.db('blogs').collection('blogs').findOne({ _id: new ObjectId(req.params.id) });
        // console.log(responseBlog)
        if (responseBlog) {
            res.status(200).send(responseBlog);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.sendStatus(404);
    }
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
        yield db_1.client.connect();
        const responseBlog = yield db_1.client.db('blogs').collection('blogs').insertOne(newBlog);
        exports.blogs.push(newBlog);
        res.status(201).send(newBlog);
    }
    catch (error) {
        console.error('Ошибка при добавлении данных в коллекцию:', error);
        res.status(500).send('Ошибка при добавлении данных в коллекцию');
    }
}));
exports.blogsRouter.put('/:id', ...blogValidators, (req, res) => {
    console.log(req.headers, 'req.headers');
    let findBlogToUpdate = exports.blogs.find(b => String(b._id) === req.params.id);
    if (!findBlogToUpdate) {
        res.sendStatus(404);
        return;
    }
    else {
        exports.blogs.forEach(b => {
            if (String(b._id) === req.params.id) {
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
    let findBlogToDeleteIndex = exports.blogs.findIndex(b => String(b._id) === req.params.id);
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
