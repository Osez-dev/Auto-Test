import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['emails', 'name'],
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    try {
      const { name, emails } = profile;
      const user = {
        email: emails ? emails[0].value : `${profile.id}@facebook.com`,
        firstName: name.givenName || profile.name?.split(' ')[0] || '',
        lastName:
          name.familyName || profile.name?.split(' ').slice(1).join(' ') || '',
        phoneNumber: '', // Adding default empty phoneNumber
        password: Math.random().toString(36).slice(-8), // Random password
        role: 'customer',
      };

      const result = await this.authService.validateFacebookUser(user);
      done(null, result);
    } catch (error) {
      done(error, false);
    }
  }
}
