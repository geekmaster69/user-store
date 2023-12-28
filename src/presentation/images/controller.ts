import { Request, Response } from "express";

import fs from 'fs';
import path from 'path';

export class ImageController{

    constructor(){}


    getImages = (req: Request, res: Response) =>{

        const {type = '', img = '' } = req.params;

        const imagePAth = path.resolve(__dirname, `../../../uploads/${type}/${img}`);

        if(!fs.existsSync(imagePAth)){
            return res. status(404).send('Image not found');
        }


        res.sendFile(imagePAth);
    }
}