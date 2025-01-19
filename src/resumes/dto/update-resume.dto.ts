import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { Types } from 'mongoose';
import { IsArray, IsEmail, IsNotEmpty, ValidatePromise } from 'class-validator';
import { Type } from 'class-transformer';

class UpdatedBy {
    @IsNotEmpty()
    _id: Types.ObjectId

    @IsNotEmpty()
    @IsEmail()
    email: string
}

class History {
    @IsNotEmpty()
    status: string

    @IsNotEmpty()
    updatedAt: Date

    @ValidatePromise()
    @IsNotEmpty()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy
}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @ValidatePromise()
    @IsNotEmpty({ message: 'History is required' })
    @IsArray({ message: 'History is array' })
    @Type(() => History)
    history: History[]
}
