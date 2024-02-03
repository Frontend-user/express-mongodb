
// const MongoCLient = require("mongodb");

// const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
import {MongoClient} from 'mongodb'
import {BlogType} from "../types/blog-type";
// console.log(process.env.MONGO_URL)

// const mongoUri = process.env.mongoUri = 'ds'
const url = 'mongodb+srv://adminmongodb:123pas123@cluster0.x20tuj1.mongodb.net/blogs?retryWrites=true&w=majority'
console.log('url',url)
export const client = new MongoClient(url)
export let  exportBlogs = []
export const getData = async  () => {
   await client.connect()
        .then(() => {
            // Получаем коллекцию "blogs"
            const blogsCollection =  client.db().collection('blogs');

            // Теперь у вас есть доступ к коллекции "blogs" для выполнения запросов
            // Например, можно получить все документы в коллекции
            blogsCollection.find({}).toArray()
                .then((blogs) => {
                        exportBlogs = blogs
                   console.log('Документы в коллекции "blogs":', blogs);
                })
                .catch((error) => {
                    console.error('Ошибка при выполнении запроса:', error);
                })
                .finally(() => {
                    // Не забывайте закрывать соединение после использования
                    client.close();
                });
        })
return exportBlogs
}

export const createBlog = async () => {
    client.connect()
        .then(() => {
            // Получаем коллекцию "blogs"
            const blogsCollection = client.db().collection('blogs');
            const newBlog: BlogType = {
                id: String(Date.now()),
                name: 'string name',
                description:  'string decsc',
                websiteUrl:  'string Web site'
            }
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
                    client.close();
                });
        })
        .catch((error) => {
            console.error('Ошибка при подключении к базе данных:', error);
        });
}

// export const dbBlogs = client.db().getCollection("blogs")
export const  runDb = async () =>{
    try {

        await client.connect();
        // await client.db('posts').command({ping: 1});
        console.log('Connect successfully to mongo server')


    }catch(e) {

        console.log('DONT connect successfully to mongo server')
        await client.close()
    }
}