import {Request, Response, Router} from "express";
import {app} from "../app";
import {client} from "../repositories/db";

export const testRouter = Router({})

testRouter.delete('/all-data', async (req: Request, res: Response) => {
    try {
        await client.connect()

        await client.db('blogs').collection('blogs').deleteMany({});

        res.sendStatus(204)

    } catch (error) {
        console.error('Ошибка при попытке удалить все данные из бд')
    }
})