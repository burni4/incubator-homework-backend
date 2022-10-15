import {Request, Response, Router} from "express";

export const videos: videoType[] = [];

// types +
type videoType = {
    "id": number,
    "title": string,
    "author": string,
    "canBeDownloaded": boolean,
    "minAgeRestriction": number,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": string[]
}
// types -

export  const ht_01_Router = Router({});

ht_01_Router.get('/', (req: Request, res: Response) => {

    res.status(200).send(videos);

})

ht_01_Router.get('/:id', (req: Request, res: Response) => {

    let video = videos.find(v => v.id === +req.params.id)

    if (video){
        res.status(200).send(video);
    }else{
        res.send(404);
    }

})