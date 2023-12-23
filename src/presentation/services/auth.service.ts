import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegiserUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {

    //* DI
    constructor(
        private readonly emailService: EmailService

    ) { }


    public async registerUser(registerUserDto: RegiserUserDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });

        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            // * Email de confirmacion
            await this.sendEmailValidationLick(user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({id: user.id});
            if(!token) throw CustomError.internalServer('Error while creating JWT');

            return { user: userEntity, token: token };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);

        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });

        if (!user) throw CustomError.badRequest("User doesn't exist");

        const hasmach = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!hasmach) throw CustomError.unAuthorized('email or password is wrong')

        const { password, ...userEntity } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({id: user.id});
        if(!token) throw CustomError.internalServer('Error while creating JWT');

        return { 
            user: userEntity, 
            token: token
         };
    }


    private sendEmailValidationLick = async(email: string) =>{

        const token = await JwtAdapter.generateToken({email});

        if(!token) throw CustomError.internalServer('error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${link}">Validate your email</a>
        `;

        const options = {
            to: email,
            subject: 'Calidate your email',
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail(options);
        if(!isSent) throw CustomError.internalServer('Error sending email');

        return true;
    }


   public validateEmail = async (token: string)=>{

    const payload = await JwtAdapter.validateToke(token);

    if(!payload) throw CustomError.unAuthorized('Invalid token');

    const {email} = payload as {email:string};

    if(!email) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({email});
    if(!user) throw CustomError.internalServer('Email not exists');

    user.emailValidated = true;
    await user.save();

    return true;
   }
}