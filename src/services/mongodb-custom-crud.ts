import {Request, Response} from "express";
import {client} from "../repositories/db";
import {ObjectId} from "mongodb";

export const changeIdFormat = (obj: any) => {
    obj.id = obj._id
    delete obj._id
    return obj
}

export const mongodbGetAll =
    async (res: Response, dbName: string, collectionName: string) => {
        try {
            await client.connect()
            const getArray = await client.db(dbName).collection(collectionName).find({}).toArray();
            const fixArrayIds = getArray.map((item => changeIdFormat(item)))
            res.status(200).send(fixArrayIds)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.status(500).send('Ошибка при получении данных из коллекции');
        }
    }

export const mongodbGetById =
    async (res: Response, dbName: string, collectionName: string, id:string) => {
        try {
            await client.connect()
            const item = await client.db(dbName).collection(collectionName).findOne({_id: new ObjectId(id)})
            if (item) {
                let changedItem = changeIdFormat(item)
                res.status(200).send(changedItem)
            } else {
                res.sendStatus(404)
            }

        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(404)

        }
    }
export const mongodbCreate = async (res: Response, dbName: string, collectionName: string, newItem: Object) => {

    try {
        await client.connect()
        const response = await client.db(dbName).collection(collectionName).insertOne(newItem)
        if (response.insertedId) {
            let findNewItem = await client.db(dbName).collection(collectionName).findOne({_id: response.insertedId});
            if (findNewItem) {
                let sendNewItem = changeIdFormat(findNewItem)
                res.status(201).send(sendNewItem)
            }

        } else {
            res.status(500).send('Ошибка при добавлении данных в коллекцию');
        }
    } catch (error) {
        console.error('Ошибка при добавлении данных в коллекцию:', error);
        res.status(500).send('Ошибка при добавлении данных в коллекцию');

    }
}


