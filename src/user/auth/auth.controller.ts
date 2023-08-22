import { Body, Controller, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, KeyDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post("/signup/:userType")    
    async signUpUser(
        @Body() body: SignUpDto, 
        @Param("userType", new ParseEnumPipe(UserType)) userType: UserType) {

        //Step 10: If the user who wants to signup is not a buyer, then check for the product key if it is not valid then throw an error
        if (userType !== UserType.BUYER) {
            if(!body.productKey) { 
                throw new UnauthorizedException("Product key is required")
            }

            const productKey = `${body.email}-${userType}-${process.env.PRODUCT_SECRET}`
            const isMatch = await bcrypt.compare(productKey, body.productKey);
            console.log()
            if(!isMatch) {
                throw new UnauthorizedException("Invalid product key")
            }

        }
        
        return this.authService.signUpUser(body, userType);
    }

    @Post("/signin")
    signInUser(@Body() body: SignInDto) {
        return this.authService.signInUser(body);
    }

    //signout can be easily implemented by removing the token from the client side


    @Post("/key")
    generateProductKey(@Body() body: KeyDto) {
        return this.authService.generateProductKey(body);
    }
}
