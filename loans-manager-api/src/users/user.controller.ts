import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '../dto/user.dto';

@Controller('auth')
export class UsersController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signup(@Body() body: { name: string; email: string }) {
    return this.userService.signup(body);
  }

 
  @Post('/login')
  async login(@Body() userDto: UserDto) {
    try {
      return await this.userService.login(userDto);
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }
}
