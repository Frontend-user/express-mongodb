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
exports.mongodbCreate = exports.mongodbGetById = exports.mongodbGetAll = exports.changeIdFormat = void 0;
const db_1 = require("../repositories/db");
const mongodb_1 = require("mongodb");
const changeIdFormat = (obj) => {
    obj.id = obj._id;
    delete obj._id;
    return obj;
};
exports.changeIdFormat = changeIdFormat;
const mongodbGetAll = (res, dbName, collectionName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        const getArray = yield db_1.client.db(dbName).collection(collectionName).find({}).toArray();
        const fixArrayIds = getArray.map((item => (0, exports.changeIdFormat)(item)));
        res.status(200).send(fixArrayIds);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.status(500).send('Ошибка при получении данных из коллекции');
    }
});
exports.mongodbGetAll = mongodbGetAll;
const mongodbGetById = (res, dbName, collectionName, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        const item = yield db_1.client.db(dbName).collection(collectionName).findOne({ _id: new mongodb_1.ObjectId(id) });
        if (item) {
            let changedItem = (0, exports.changeIdFormat)(item);
            res.status(200).send(changedItem);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.sendStatus(404);
    }
});
exports.mongodbGetById = mongodbGetById;
const mongodbCreate = (res, dbName, collectionName, newItem) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        const response = yield db_1.client.db(dbName).collection(collectionName).insertOne(newItem);
        if (response.insertedId) {
            let findNewItem = yield db_1.client.db(dbName).collection(collectionName).findOne({ _id: response.insertedId });
            if (findNewItem) {
                let sendNewItem = (0, exports.changeIdFormat)(findNewItem);
                res.status(201).send(sendNewItem);
            }
        }
        else {
            res.status(500).send('Ошибка при добавлении данных в коллекцию');
        }
    }
    catch (error) {
        console.error('Ошибка при добавлении данных в коллекцию:', error);
        res.status(500).send('Ошибка при добавлении данных в коллекцию');
    }
});
exports.mongodbCreate = mongodbCreate;
