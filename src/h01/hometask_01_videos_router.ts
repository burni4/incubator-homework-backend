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
    "minAgeRestriction": number | null,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": Resolutions[] | null
}

enum Resolutions { P144 = "P144", P240="P240", P360="P360", P480="P480", P720 = "P720", P1080= "P1080", P1440="P1440", P2160="P2160"}
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

ht_01_Router.delete("/testing/all-data", (req: Request, res: Response) => {
    videos.splice(0,videos.length)
    res.status(204);
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
        minAgeRestriction: null,
        createdAt: createdDate.toISOString(),
        publicationDate: new Date(createdDate.setDate(createdDate.getDate() + 1)).toISOString(),
        availableResolutions: null
    };

    newVideo.title = body.title;
    newVideo.author = body.author;
    newVideo.availableResolutions = body.availableResolutions;

    if (body.availableResolutions !== undefined){
        newVideo.availableResolutions = body.availableResolutions;
    }
    if (body.canBeDownloaded !== undefined){
        newVideo.canBeDownloaded = body.canBeDownloaded;
    }
    if (body.minAgeRestriction !== undefined){
        newVideo.minAgeRestriction = body.minAgeRestriction;
    }
    if (body.publicationDate !== undefined){
        newVideo.publicationDate = body.publicationDate;
    }

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

        if (body.availableResolutions !== undefined){
            video.availableResolutions = body.availableResolutions;
        }
        if (body.canBeDownloaded !== undefined){
            video.canBeDownloaded = body.canBeDownloaded;
        }
        if (body.minAgeRestriction !== undefined){
            video.minAgeRestriction = body.minAgeRestriction;
        }
        if (body.publicationDate !== undefined){
            video.publicationDate = body.publicationDate;
        }

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

    return {errorsMessages:[]};

}

function FieldsValidation(body: any): boolean{

    ClearErrorsMessages();

    let validationPassed = true;

    if (body.title === undefined || typeof (body.title) !== 'string' || body.title.length > 40){
        AddMessage("title", "inputModel [title] has incorrect values");
        validationPassed = false;
    }

    if (body.author === undefined || typeof (body.author) !== 'string' || body.author.length > 20){
        AddMessage("author", "inputModel [author] has incorrect values");
        validationPassed = false;
    }

    if (body.availableResolutions !== undefined && !ResolutionsIsValid(body.availableResolutions)){
        AddMessage("availableResolutions", "inputModel [availableResolutions] has incorrect values");
        validationPassed = false;
    }

    if (body.canBeDownloaded !== undefined && typeof (body.canBeDownloaded) !== 'boolean'){
        AddMessage("canBeDownloaded", "inputModel [canBeDownloaded] has incorrect values");
        validationPassed = false;
    }

    if (body.minAgeRestriction !== undefined && (typeof (body.minAgeRestriction) !== 'number') || body.minAgeRestriction < 1 || body.minAgeRestriction > 18){
        AddMessage("minAgeRestriction", "inputModel [minAgeRestriction] has incorrect values");
        validationPassed = false;
    }

    if (body.publicationDate !== undefined && typeof (body.publicationDate) !== 'string'){
        AddMessage("publicationDate", "inputModel [publicationDate] has incorrect values");
        validationPassed = false;
    }

    return validationPassed;

}

function ResolutionsIsValid(res: Resolutions[]): boolean{

    let isValid = true;

    if(res.length === 0){
        return false;
    }

    for (let i = 0; i < res.length; i++){
        if (!Object.values<string>(Resolutions).includes(res[i].toUpperCase())){
            isValid = false;
            break;
        }
    }

    return isValid;

}