"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';
console.log(process.env.MONGO_URL);
// import {MongoCLient} from 'mongodb'
//
// const mongoUri =
//     process.env.mongoUri = ''
//
// export const client = new MongoCLient(mongoUri)
//
// export async function runDb(){
//     try {
//
//         await client.connect();
//
//         await client.db('posts').command({ping: 1});
//         console.log('Connect successfully to mongo server')
//
//
//     }catch {
//         await client.close()
//     }
// }
