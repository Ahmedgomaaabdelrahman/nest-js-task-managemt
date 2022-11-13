import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredtionalsDto } from './dto/auth-cred.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('/signup')
    signUp(@Body() authCredtionalsDto: AuthCredtionalsDto): Promise<void>{
        return this.authService.createUser(authCredtionalsDto);
    }

    @Post('/signin')
    signIn(@Body() authCredtionalsDto: AuthCredtionalsDto): Promise<any>{
        return this.authService.signIn(authCredtionalsDto);
    }

}
