import {MongoClient} from 'mongodb'
import {BlogType} from "../types/blog-type";

import dotenv from 'dotenv'
dotenv.config()

const url = process.env.MONGO_URL

if(!url){
    throw new Error('! Url doesn\'t found')
}

console.log('url',url)

export const client = new MongoClient(url)


export const  runDb = async () =>{
    try {

        await client.connect();
        await client.db('blogs').command({ping: 1});
        console.log('Connect successfully to mongo server')


    }catch(e) {

        console.log('DONT connect successfully to mongo server')
        await client.close()
    }
}