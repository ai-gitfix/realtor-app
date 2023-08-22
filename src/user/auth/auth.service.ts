import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignUpParams {
    email: string;
    password: string;
    name: string;
    phone: string;
    productKey?: string;
}

interface SignInParams {
    email: string;
    password: string;
}

interface KeyParams {
    email: string;
    userType: UserType;
}
@Injectable()
export class AuthService {
    
    //Step 2:import the prisma service in order to signup and manipulate the user information
    constructor(private readonly prismaService: PrismaService) {}

    async signUpUser({email, password, name, phone }: SignUpParams , userType: UserType) {

        const IsUserExist = await this.prismaService.user.findUnique({ where: { email } });

        if (IsUserExist) {
            throw new ConflictException("User already exists");
        }

        //Step3: Hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await this.prismaService.user.create({ 
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                user_type: userType,
            }
        });

        
        // npm install jsonwebtoken @types/jsonwebtoken
        //Step 4 : Create a JWT token and return it
        const token = this.generateToken(user.name, user.id);

        return token;
    }


    //Step 5: Authenticate the user information with the help of DTO
    async signInUser({email, password}: SignInParams) {

        //Step 6: Check if the user exists in the database if not throw an error
        const user = await this.prismaService.user.findUnique({ where: { email } });

        if (!user) {
            throw new HttpException("Invalid credentials", 401);
        }

        //Step 7: If the user exists in the database then check if the password matches with the help of bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new HttpException("Invalid credentials", 401);
        }

        //Step 8: If the password matches then generate a JWT token and send it back to the user
        const token = this.generateToken(user.name, user.id);

        return token;        
    }

    private generateToken(name: string, id: number) {
        return jwt.sign(
            { name, id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' });
    }


    //Step 9: Create a product key for the user which wants to be an admin or estator
    generateProductKey({email, userType}: KeyParams) {
        const string = `${email}-${userType}-${process.env.PRODUCT_SECRET}`
        return bcrypt.hash(string, 10);//This will be the product key and will be sent to the user to sign up as an admin or estator
    }
}
