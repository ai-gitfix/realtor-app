//npm install class-validator class-transformer
import { UserType } from '@prisma/client';
import { IsString, IsNotEmpty, Matches, IsEmail, MinLength, isEnum, IsEnum, IsOptional } from 'class-validator';


//Step1: Authenticate the user information with the help of DTO
export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @Matches(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, {
        message: "Phone number was not in the correct format.",
    })
    phone: string;

    @IsString()
    @MinLength(5,{
        message: "Password must be at least 5 characters long.",
    })
    password: string;

    @IsOptional()
    productKey: string;
}

export class SignInDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

}

export class KeyDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsEnum(UserType)
    userType: UserType;

}