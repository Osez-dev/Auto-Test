import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
  
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestException('Invalid user ID');
      }
      return await this.usersService.updateUser(userId, updateUserDto);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

@Put(':id')
async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.usersService.findOne(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return this.usersService.update(id, updateUserDto);
}
}
