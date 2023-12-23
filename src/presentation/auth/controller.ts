import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegiserUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";


export class AuthControler {

    //* DI
    constructor(
        public readonly autService: AuthService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);

        return res.status(500).json({ error: 'Internal server error' });

    }

    registerUser = (req: Request, res: Response) => {

        const [error, regiserUserDto] = RegiserUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.autService.registerUser(regiserUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res));

    }
    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.autService.loginUser(loginUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res));

    }
    validateEmail = (req: Request, res: Response) => {

        const { token } = req.params;
        this.autService.validateEmail(token)
            .then(() => res.json('Email validated'))
            .catch(error => this.handleError(error, res));
    }

}