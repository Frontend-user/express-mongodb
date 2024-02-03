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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.createBlog = exports.getData = exports.exportBlogs = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const url = process.env.MONGO_URL;
if (!url) {
    throw new Error('! Url doesn\'t found');
}
console.log('url', url);
exports.client = new mongodb_1.MongoClient(url);
exports.exportBlogs = [];
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.client.connect()
        .then(() => {
        // Получаем коллекцию "blogs"
        const blogsCollection = exports.client.db().collection('blogs');
        // Теперь у вас есть доступ к коллекции "blogs" для выполнения запросов
        // Например, можно получить все документы в коллекции
        blogsCollection.find({}).toArray()
            .then((blogs) => {
            exports.exportBlogs = blogs;
            console.log('Документы в коллекции "blogs":', blogs);
        })
            .catch((error) => {
            console.error('Ошибка при выполнении запроса:', error);
        })
            .finally(() => {
            // Не забывайте закрывать соединение после использования
            exports.client.close();
        });
    });
    return exports.exportBlogs;
});
exports.getData = getData;
const createBlog = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.client.connect()
        .then(() => {
        // Получаем коллекцию "blogs"
        const blogsCollection = exports.client.db().collection('blogs');
        const newBlog = {
            id: String(Date.now()),
            name: 'TESTTT as',
            description: 'string decsc',
            websiteUrl: 'string Web site'
        };
        // Добавляем объект в коллекцию
        blogsCollection.insertOne(newBlog)
            .then((result) => {
            console.log('Объект успешно добавлен в коллекцию "blogs".');
        })
            .catch((error) => {
            console.error('Ошибка при добавлении объекта в коллекцию:', error);
        })
            .finally(() => {
            // Не забывайте закрывать соединение после использования
            exports.client.close();
        });
    })
        .catch((error) => {
        console.error('Ошибка при подключении к базе данных:', error);
    });
});
exports.createBlog = createBlog;
// export const dbBlogs = client.db().getCollection("blogs")
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        // await client.db('posts').command({ping: 1});
        console.log('Connect successfully to mongo server');
    }
    catch (e) {
        console.log('DONT connect successfully to mongo server');
        yield exports.client.close();
    }
});
exports.runDb = runDb;
