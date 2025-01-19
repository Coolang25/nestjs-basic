import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, isObject, IsObject, IsString, Validate, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty({ message: 'Id is required' })
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: 'Name is required' })
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsArray({ message: 'Skills are array' })
    @IsString({ each: true, message: 'Skill is string' })
    skills: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'Salary is required' })
    salary: number;

    @IsNotEmpty({ message: 'Quantity is required' })
    quantity: number;

    @IsNotEmpty({ message: 'Level is required' })
    level: string;

    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @IsNotEmpty({ message: 'Start date is required' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'Start date is not valid' })
    startDate: Date;

    @IsNotEmpty({ message: 'End date is required' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'End date is not valid' })
    endDate: Date;

    @IsNotEmpty({ message: 'isActive is required' })
    @IsBoolean({ message: 'isActive is not valid' })
    isActive: boolean;


}

