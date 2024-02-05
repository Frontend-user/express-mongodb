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
const mongodb_custom_crud_1 = require("../services/mongodb-custom-crud");
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
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongodb_custom_crud_1.mongodbGetAll)(res, 'blogs', 'posts');
}));
exports.postsRouter.get('/:id', posts_validation_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // let findedPost = posts.filter(b => b.id === req.params.id)[0]
    // if (findedPost) {
    //     res.status(200).send(findedPost)
    // } else {
    //     res.sendStatus(404)
    // }
    yield (0, mongodb_custom_crud_1.mongodbGetById)(res, 'blogs', 'posts', req.params.id);
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
    yield (0, mongodb_custom_crud_1.mongodbCreate)(res, 'blogs', 'posts', newPost);
}));
// postsRouter.put('/:id',
//     ...postValidators,
//     (req: Request, res: Response) => {
//         console.log(req.headers, 'req.headers')
//         let postToUpdate = posts.find(b => b.id === req.params.id)
//         if (!postToUpdate) {
//             res.sendStatus(404)
//             return
//         } else {
//             posts.forEach(b => {
//                 if (b.id === req.params.id) {
//                     b.title = req.body.title
//                     b.shortDescription = req.body.shortDescription
//                     b.content = req.body.content
//                     b.blogId = req.body.blogId
//                     res.sendStatus(204)
//                     return
//                 }
//
//             })
//
//         }
//     })
// postsRouter.delete('/:id',
//     authorizationMiddleware,
//     postIdValidation,
//     (req: Request, res: Response) => {
//         let postToDeleteIndex = posts.findIndex(b => b.id === req.params.id)
//         if (postToDeleteIndex > -1) {
//             posts.splice(postToDeleteIndex, 1)
//             res.sendStatus(204)
//             return;
//         } else {
//             res.sendStatus(404)
//             return
//         }
//     })
