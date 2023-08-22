import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
        console.log(IsUserExist);

        if (IsUserExist) {
            throw new ConflictException("User already exists");
        }
        return ;
    }

}
