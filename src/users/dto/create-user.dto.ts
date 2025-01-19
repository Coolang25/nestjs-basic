import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, isObject, IsObject, Validate, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty({ message: 'Id is required' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;
}

export class CreateUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail({}, { message: 'Email is not in correct format.' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Passwd is required' })
    password: string;

    @IsNotEmpty({ message: 'Age is required' })
    age: number;

    @IsNotEmpty({ message: 'Gender is required' })
    gender: string;

    @IsNotEmpty({ message: 'Address is required' })
    address: string;

    @IsNotEmpty({ message: 'Role is required' })
    @IsMongoId({ message: '...' })
    role: mongoose.Schema.Types.ObjectId;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail({}, { message: 'Email is not in correct format.' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Passwd is required' })
    password: string;

    @IsNotEmpty({ message: 'Age is required' })
    age: number;

    @IsNotEmpty({ message: 'Gender is required' })
    gender: string;

    @IsNotEmpty({ message: 'Address is required' })
    address: string;
}

