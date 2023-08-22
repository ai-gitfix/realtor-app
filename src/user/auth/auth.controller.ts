import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}
    
    @Post("/signup")    
    signUpUser(@Body() body: SignUpDto) {
        return this.authService.signUpUser(body);
    }

    @Post("/signin")
    signInUser(@Body() body: SignInDto) {
        return this.authService.signInUser(body);
    }

    //signout can be easily implemented by removing the token from the client side

}
