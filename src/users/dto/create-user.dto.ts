import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Email is not in correct format.' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Passwd is required' })
    password: string;

    name: string;
    address: string;
}
