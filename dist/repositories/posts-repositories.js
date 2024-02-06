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
exports.postsRepositories = exports.changeIdFormat = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
const changeIdFormat = (obj) => {
    obj.id = obj._id;
    delete obj._id;
    delete obj.isMembership;
    return obj;
};
exports.changeIdFormat = changeIdFormat;
exports.postsRepositories = {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.postsCollection.find({}).toArray();
            const fixArrayIds = posts.map((item => (0, exports.changeIdFormat)(item)));
            if (fixArrayIds.length > 0) {
                return fixArrayIds;
            }
            else {
                return [];
            }
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            console.log(post, 'post');
            if (post) {
                let changedItem = (0, exports.changeIdFormat)(post);
                return changedItem;
            }
            else {
                return false;
            }
        });
    },
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.postsCollection.insertOne(post);
            console.log(response, 'respomse');
            if (response.insertedId) {
                return response.insertedId;
            }
            else {
                return false;
            }
        });
    },
    updatePost(id, updatePost) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.postsCollection.updateOne({ _id: id }, { $set: updatePost });
            if (response.matchedCount === 1) {
                return true;
            }
            else {
                return false;
            }
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.postsCollection.deleteOne({ _id: id });
            if (response.deletedCount) {
                return true;
            }
            else {
                return false;
            }
        });
    },
};
