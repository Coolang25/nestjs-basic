import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {

    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @IsNotEmpty({ message: 'isActive is required' })
    @IsBoolean({ message: 'isActive is boolean' })
    isActive: string;

    @IsNotEmpty({ message: 'permissions is required' })
    @IsMongoId({ each: true, message: 'Each permission is ...' })
    @IsArray({ message: 'permissons is array' })
    permissions: mongoose.Schema.Types.ObjectId[]
}
