import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";



export class FileUploadController {


    constructor(
        private readonly fileUploadService: FileUploadService

    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }


    uploadFile = (req: Request, res: Response) => {
        const files = req.files;

        const type = req.params.type;
        const validTypes = ['users', 'products', 'categories'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: `Invalid type: ${type}, valid ones: ${validTypes}` });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were selected' });
        }

        const file = req.files.file as UploadedFile;

        this.fileUploadService.uploadSingle(file, `uploads/${type}`)
            .then(uploades => res.json(uploades))
            .catch(error => this.handleError(error, res));



    }

    uploadMultipleFile = (req: Request, res: Response) => {

        res.json('uploadMiltipleFile');

    }



}