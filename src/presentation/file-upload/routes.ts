import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadService } from "../services/file-upload.service";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { TypeMiddleware } from "../middlewares/type.middleware";


export class FileUploadRoutes {

    static get routes(): Router {

        const router = Router();

        const controller = new FileUploadController(
            new FileUploadService()
        );

        router.use(FileUploadMiddleware.conteinFiles);
      //  router.use(TypeMiddleware.validTypes(['users', 'products', 'categories']));

        router.post('/single/:type', [TypeMiddleware.validTypes(['users', 'products', 'categories'])], controller.uploadFile);
        router.post('/multiple/:type', [TypeMiddleware.validTypes(['users', 'products', 'categories'])], controller.uploadMultipleFile);


        return router;
    }

}