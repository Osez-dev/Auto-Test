import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as crypto from 'crypto';
import { EmailService } from './email.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private generateToken(payload: { id: number; email: string }): string {
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<{ id?: number; accessToken?: string; refreshToken?: string; message?: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      return { message: 'Email not verified. Please check your inbox.' };
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = this.generateToken(payload);

    return {
      id: user.id,
      accessToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string }> {
    try {
        const payload = this.jwtService.verify(refreshToken);
        const user = await this.usersService.findOne(payload.id);

        if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newPayload = { id: user.id, email: user.email };
        const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '1h' });
        const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

        // Update refresh token in DB
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
        await this.usersService.update(user.id, { refreshToken: hashedRefreshToken });

        return { accessToken: newAccessToken, newRefreshToken };
    } catch (error) {
        throw new UnauthorizedException('Invalid or expired refresh token');
    }
}

async loginWithProfile(payload: any) {
  try {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      this.logger.warn(`Login attempt failed: User not found for ID ${payload.sub}`);
      throw new UnauthorizedException('Invalid token');
    }

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' }
    );

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  } catch (error) {
    this.logger.error(`Login error: ${error.message}`);
    throw new UnauthorizedException('Invalid token');
  }
}

  async getUserProfile(userId: number): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return only necessary fields
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      id: user.id,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    let user = await this.usersService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.create(googleUser);
    }
    
    // Generate refresh token
    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '7d' }
    );
    
    // Hash and save refresh token in the database
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: user.refreshToken });
    
    return user;
  }

  
  async register(createUserDto: CreateUserDto): Promise<{ message: string; accessToken?: string; refreshToken?: string }> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
        throw new BadRequestException('Email already in use');
    }

    // Hash the password BEFORE passing it to users.service.ts
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log('Original Password:', createUserDto.password);
    console.log('Hashed Password before storing:', hashedPassword);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Send the hashed password to users.service.ts
    const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword, // Pass already hashed password
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 3600000), // Token expires in 1 hour
        isEmailVerified: false,
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store hashed refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashedRefreshToken });

    return { 
        message: 'Registration successful. Please check your email for verification.', 
        accessToken, 
        refreshToken 
    };
}


  

  
async verifyEmail(token: string) {
  const user = await this.usersService.findByVerificationToken(token);

  if (!user) {
      throw new NotFoundException('Invalid or expired token.');
  }

  if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified.');
  }

  if (user.emailVerificationExpires && new Date() > new Date(user.emailVerificationExpires)) {
      throw new BadRequestException('The verification link has expired.');
  }

  // Update user to be verified
  await this.usersService.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
  });

  return { message: 'Email successfully verified! You can now log in.' };
}


async sendPasswordResetEmail(email: string): Promise<{ message: string }> {
  const user = await this.usersService.findByEmail(email);
  if (!user) {
      throw new NotFoundException('User not found');
  }

  // Generate a secure token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour

  await this.usersService.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: user.passwordResetExpires
  });

  // Send email
  await this.emailService.sendPasswordResetEmail(user.email, resetToken);

  return { message: 'Password reset email sent. Check your inbox.' };
}
  

async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const user = await this.usersService.findByResetToken(token);
  if (!user || !user.passwordResetExpires || new Date() > new Date(user.passwordResetExpires)) {
      throw new BadRequestException('Invalid or expired reset token');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token
  await this.usersService.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
  });

  return { message: 'Password reset successful. You can now log in.' };
}


// validateFacebookUser method
async validateFacebookUser(facebookUser: any) {
  let user = await this.usersService.findByEmail(facebookUser.email);

  if (!user) {
    // Use the static method to create user with default values
    const createUserDto = CreateUserDto.createSocialUser({
      email: facebookUser.email,
      firstName: facebookUser.firstName,
      lastName: facebookUser.lastName,
      password: await bcrypt.hash(Math.random().toString(36), 10),
      role: 'customer',
      facebookId: facebookUser.id,
      phoneNumber: '', // Default empty string for backward compatibility
    });

    user = await this.usersService.create(createUserDto);
  }

  const payload = { id: user.id, email: user.email };
  const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
  const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await this.usersService.update(user.id, {
    refreshToken: user.refreshToken,
  });

  return {
    accessToken,
    refreshToken,
    profile: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

async refreshToken(refreshToken: string) {
  try {
    const payload = this.jwtService.verify(refreshToken);
    const user = await this.usersService.findOne(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      this.logger.warn('Invalid refresh token');
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newPayload = { id: user.id, email: user.email };
    const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

    await this.usersService.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    this.logger.error(`Refresh token error: ${error.message}`);
    throw new UnauthorizedException('Invalid refresh token');
  }
}

async validateUser(payload: any) {
  try {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      this.logger.warn(`User validation failed: User not found for ID ${payload.id}`);
      throw new UnauthorizedException('User not found');
    }
    return user;
  } catch (error) {
    this.logger.error(`User validation error: ${error.message}`);
    throw error;
  }
}
}

