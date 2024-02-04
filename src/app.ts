import express, {NextFunction, Request, Response, Router} from 'express'
import {runDb} from "./repositories/db";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/blogs',blogsRouter)
app.use('/posts', postsRouter)
