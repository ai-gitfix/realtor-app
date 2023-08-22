import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

interface SignUpParams {
    email: string;
    password: string;
    name: string;
    phone: string;
}

@Injectable()
export class AuthService {
    
    //Step 2:import the prisma service in order to signup and manipulate the user information
    constructor(private readonly prismaService: PrismaService) {}

    async signUpUser({email, password, name, phone }: SignUpParams) {

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
                user_type: UserType.BUYER,
            }
        });

        
        // npm install jsonwebtoken @types/jsonwebtoken
        //Step 4 : Create a JWT token and return it
        const token = jwt.sign(
            { name, id: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' });


        return token;
    }

}
