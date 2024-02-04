import express, {NextFunction, Request, Response} from 'express'
import {client, runDb} from "./repositories/db";
import {app} from "./app";

const PORT = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('w')
})



app.delete('/testing/all-data', async (req: Request, res: Response) => {
try {
    await client.connect()

    await client.db('blogs').collection('blogs').deleteMany({});

    res.sendStatus(204)

}catch (error){
    console.error('Ошибка при попытке удалить все данные из бд')
}
})


const startApp = async () => {
    await runDb()
    app.listen(PORT, () => {
        console.log(`START on PORT ${PORT}`)
    })

}
startApp()
