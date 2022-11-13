import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private usersRepository : Repository<User>
    ) {
        super({
            secretOrKey:'secretKey',
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) : Promise<User>{
        const {username} = payload;
        const user = await this.usersRepository.findOne({
            where: {
                username,
            },
          });
          if(!user) {
            throw new UnauthorizedException()
          }

          return user;
    }
}