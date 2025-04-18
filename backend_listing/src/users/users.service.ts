import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password, role } = createUserDto;

      // Validate required fields
      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }

      // Check for existing user
      const existingUser = await this.usersRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      // Create new user with default role if not provided
      const user = this.usersRepository.create({
        ...createUserDto,
        password: password, // Use the provided password (should be hashed)
        role: role || 'Customer',
        isEmailVerified: false // Set default email verification status
      });

      // Save the user
      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    console.log('Looking up user with email:', email);
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByVerificationToken(token: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        emailVerificationToken: token,
      },
    });
  }

  async findByGoogleId(googleId: string): Promise<User> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
}
  

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      role: createUserDto.role || 'customer', // Default to 'customer'
    });
    return this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // Ensure id is a valid number
      const userId = Number(id);
      if (isNaN(userId)) {
        throw new BadRequestException('Invalid user ID');
      }
    
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // If only role is being updated
      if (Object.keys(updateUserDto).length === 1 && 'role' in updateUserDto) {
        user.role = updateUserDto.role;
      } else {
        // For other updates, use Object.assign
        Object.assign(user, updateUserDto);
      }
      
      const updatedUser = await this.usersRepository.save(user);
      return updatedUser;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { emailVerificationToken: token } });
  
    if (!user) {
      throw new NotFoundException('Invalid or expired token.');
    }
  
    // Check if the token has expired
    if (new Date() > new Date(user.emailVerificationExpires)) {
      throw new BadRequestException('The verification link has expired.');
    }
  
    // Proceed with the verification if the token is valid
    user.isEmailVerified = true;
    user.emailVerificationToken = null;  // Clear token after successful verification
    user.emailVerificationExpires = null; // Clear expiration date
  
    await this.usersRepository.save(user);
  
    return { message: 'Email verified successfully. You can now log in.' };
  }
  async findByResetToken(token: string): Promise<User> {
    return this.usersRepository.findOne({
        where: { passwordResetToken: token }
    });
}

  async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.refreshToken = refreshToken;
    return this.usersRepository.save(user);
  }
}

