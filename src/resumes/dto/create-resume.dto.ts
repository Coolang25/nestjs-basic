import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, isObject, IsObject, IsString, Validate, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'userId is required' })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'url is required' })
    url: string;

    @IsNotEmpty({ message: 'Status is required' })
    status: number;

    @IsNotEmpty({ message: 'companyId is required' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId is required' })
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
    @IsNotEmpty({ message: 'url is required' })
    url: string;

    @IsNotEmpty({ message: 'companyId is required' })
    @IsMongoId({ message: 'companyId is invalid' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'jobId is required' })
    @IsMongoId({ message: 'jobId is invalid' })
    jobId: mongoose.Schema.Types.ObjectId;
}

