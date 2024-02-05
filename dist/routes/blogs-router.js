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
const mongodb_custom_crud_1 = require("../services/mongodb-custom-crud");
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
    yield (0, mongodb_custom_crud_1.mongodbGetAll)(res, 'blogs', 'blogs');
    // try {
    //     await client.connect()
    //     const blogsCollection = await client.db('blogs').collection('blogs').find({}).toArray();
    //     const fixArrayIds = blogsCollection.map((item => changeIdFormat(item)))
    //     res.status(200).send(fixArrayIds)
    // } catch (error) {
    //     console.error('Ошибка при получении данных из коллекции:', error);
    //     res.status(500).send('Ошибка при получении данных из коллекции');
    // }
}));
exports.blogsRouter.get('/:id', blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongodb_custom_crud_1.mongodbGetById)(res, 'blogs', 'blogs', req.params.id);
}));
exports.blogsRouter.post('/', ...blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    const newBlog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false
    };
    yield (0, mongodb_custom_crud_1.mongodbCreate)(res, 'blogs', 'blogs', newBlog);
    // await client.connect()
    // const response = await client.db('blogs').collection('blogs').insertOne(newBlog)
    // if (response.insertedId) {
    //     let createdBlog:BlogType = await client.db('blogs').collection('blogs')
    //         .findOne({ _id: response.insertedId }) as BlogType;
    //     if(createdBlog){
    //         let newBLog = changeIdFormat(createdBlog)
    //         res.status(201).send(newBLog)
    //     }
    //
    // } else {
    //     res.status(500).send('Ошибка при добавлении данных в коллекцию');
    // }
    // } catch (error) {
    //     console.error('Ошибка при добавлении данных в коллекцию:', error);
    //     res.status(500).send('Ошибка при добавлении данных в коллекцию');
    //
    // }
}));
exports.blogsRouter.put('/:id', ...blogValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        let result = yield db_1.client.db('blogs').collection('blogs').updateOne({ _id: new ObjectId(req.params.id) }, {
            $set: {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
            }
        });
        if (result.matchedCount === 1) {
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }
    catch (error) {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, blogs_validation_1.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        const responseBlog = yield db_1.client.db('blogs').collection('blogs').deleteOne({ _id: new ObjectId(req.params.id) });
        console.log(responseBlog, 'responseBlog');
        if (responseBlog.deletedCount) {
            res.sendStatus(204);
            return;
        }
        else {
            res.sendStatus(404);
            return;
        }
    }
    catch (error) {
        res.sendStatus(404);
    }
    // }
}));
