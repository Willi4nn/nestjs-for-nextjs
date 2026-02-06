import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './types/jwt-payload-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

    if (!secretKey) {
      throw new InternalServerErrorException(
        'JWT secret key is not defined in environment variables.'
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);

    if (!user || user.forceLogout) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
