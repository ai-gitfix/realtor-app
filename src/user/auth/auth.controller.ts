import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post("/signup")
    signUpUser(@Body() body: SignUpDto) {
        return this.authService.signUpUser(body);
    }

}
