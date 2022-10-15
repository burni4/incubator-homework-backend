import {Request, Response, Router} from "express";

export  const ht_01_Router = Router({});

export const videos: videoType[] = [];

const errorsMessages: errorsMessagesType = CreateErrorsMessages();
// types +

type videoType = {
    "id": number,
    "title": string,
    "author": string,
    "canBeDownloaded": boolean,
    "minAgeRestriction": number,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": Resolutions[]
}

enum Resolutions { P144, P240, P360, P480, P720, P1080, P1440, P2160 }
type messageType = {message: string, field: string}
type errorsMessagesType = { errorsMessages: messageType[]}

// types -

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

ht_01_Router.delete('/:id', (req: Request, res: Response) => {

    for (let i =  0; i < videos.length; i++){
        if(videos[i].id === +req.params.id){
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
})

ht_01_Router.post('/', (req: Request, res: Response) => {

    let body = req.body;

    if(!FieldsValidation(body)){
        res.status(400).send(errorsMessages);
        return;
    }

    let createdDate = new Date();

    let newVideo: videoType = {
        id: between(0,10000),
        title: "",
        author: "",
        canBeDownloaded: false,
        minAgeRestriction: 0,
        createdAt: createdDate.toISOString(),
        publicationDate: new Date(createdDate.setDate(createdDate.getDate() + 1)).toISOString(),
        availableResolutions: []
    };

    newVideo.title = body.title;
    newVideo.author = body.author;
    newVideo.availableResolutions = body.availableResolutions;

    videos.push(newVideo);

    res.status(201).send(newVideo);

})

ht_01_Router.put('/:id', (req: Request, res: Response) => {

    let body = req.body;

    if(!FieldsValidation(body)){
        res.status(400).send(errorsMessages);
        return;
    }

    let video = videos.find(v => v.id === +req.params.id)

    if (video){
        let body = req.body;

        video.title = body.title;
        video.author = body.author;
        //video.availableResolutions = body.availableResolutions;
        //video.canBeDownloaded = body.canBeDownloaded;
        //video.minAgeRestriction = body.minAgeRestriction;
        //video.publicationDate = body.publicationDate;

        res.status(204).send(video);
    }else{
        res.send(404);
    }

})
function between(min:number, max:number) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

function AddMessage(field:string, message:string): void{

    let errorMsg: messageType = {message: message, field: field};

    errorsMessages.errorsMessages.push(errorMsg);

}

function ClearErrorsMessages(): void{
    errorsMessages.errorsMessages = [];
}

function CreateErrorsMessages(): errorsMessagesType{

    return { errorsMessages: []};

}

function FieldsValidation(body: any): boolean{

    ClearErrorsMessages();

    let validationPassed = true;

    if (body.title === undefined || typeof (body.title) !== 'string' || body.title.length > 40){
        AddMessage("title", "inputModel [Title] has incorrect values");
        validationPassed = false;
    }

    if (body.author === undefined || typeof (body.author) !== 'string' || body.author.length > 20){
        AddMessage("author", "inputModel [Author] has incorrect values");
        validationPassed = false;
    }

    if (body.availableResolutions !== undefined && body.availableResolutions.length === 0){
        AddMessage("availableResolutions", "inputModel [AvailableResolutions] has incorrect values");
        validationPassed = false;
    }

    return validationPassed;

}