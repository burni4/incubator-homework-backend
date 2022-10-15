import express, { Request, Response } from "express"
import bodyParser from 'body-parser'
import {videos, ht_01_Router} from "./h01/hometask_01_videos_router";

const app = express()
const port = process.env.PORT || 3000
const parserMiddleware = bodyParser()

app.use(parserMiddleware);

app.use('/hometask_01/api/videos', ht_01_Router);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Homework from Artem Narchuk");
})

app.get("/testing/all-data", (req: Request, res: Response) => {
    videos.splice(0,videos.length)
    res.status(204);
})

app.get("/test", (req: Request, res: Response) => {
    res.send('Test');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})