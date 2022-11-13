import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredtionalsDto } from './dto/auth-cred.dto';
import { User } from './user.entity';
import * as bycrept from 'bcrypt';
import e from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository : Repository<User> , private jwtService: JwtService){

    }

    async createUser(authCredtionalsDto: AuthCredtionalsDto): Promise<void>{
        const {username, password} = authCredtionalsDto;

        const salt = await bycrept.genSalt();
        const hashedPassword = await bycrept.hash(password, salt);

        const user = this.usersRepository.create({username, password: hashedPassword});

        try{
            await this.usersRepository.save(user);
        }
        catch(error){ 
            console.log(error.code)
            if(error.code === '23505'){
                throw new ConflictException("This user name is already exist ")
            }
            else {
                throw new InternalServerErrorException();
            }
        }
        
    }

    async signIn(authCredtionalsDto: AuthCredtionalsDto) : Promise<any>{
        const {username, password} = authCredtionalsDto;
        const user = await this.usersRepository.findOne({
            where: {
                username,
            },
          });
        
          if(user && await(bycrept.compare(password, user.password))) {
            const payload = { username: user.username};
            return {
                access_token: this.jwtService.sign(payload),
            };
          }
          else {
            throw new UnauthorizedException("Please enter a valid credentials");
          }

    }
}
