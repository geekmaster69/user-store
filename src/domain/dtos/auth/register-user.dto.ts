import { regularExps } from "../../../config";


export class RegiserUserDto {
    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RegiserUserDto?] {

        const { name, email, password } = object;

        if (!name) return ['Missing name'];
        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (password.length < 6) return ['Password too short, min 6 caracters'];


        return [undefined, new RegiserUserDto(name, email, password)];
    }
}