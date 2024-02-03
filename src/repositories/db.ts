
import dotenv from 'dotenv'
dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'


console.log(process.env.MONGO_URL)
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