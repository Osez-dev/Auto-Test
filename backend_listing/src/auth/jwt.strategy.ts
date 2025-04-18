import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['accessToken'];
            this.logger.debug('Token found in cookies');
          }
          if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
              token = authHeader.substring(7);
              this.logger.debug('Token found in Authorization header');
            }
          }
          if (!token) {
            this.logger.warn('No token found in request');
          }
          return token;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || 'yourSecretKey',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.usersService.findOne(payload.id);
      if (!user) {
        this.logger.warn(`User not found for payload ID: ${payload.id}`);
        throw new UnauthorizedException('User not found');
      }
      return { id: user.id, email: user.email };
    } catch (error) {
      this.logger.error(`Error validating token: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
