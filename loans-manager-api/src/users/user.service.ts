import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async signup(data: Partial<User>) {

    if (await this.userRepo.findOneBy({ email: data.email })) {
      return { statusCode: 409, message: 'User already exists' };
    }

    const user = this.userRepo.create(data);
    const result = await this.userRepo.save(user);
    if (result) {
      return { statusCode: 201, message: 'User created successfully' };
    } else {
      return { statusCode: 400, message: 'User creation failed' };
    }
  }

  async login(userDto: UserDto) {
    const result = await this.userRepo.findOneBy({ email: userDto.email });
    if (!result) {
      return { statusCode: 404, message: 'User not found' };
    }
    if (result.password === userDto.password) {
      return { statusCode: 200, data: result };
    } else {
      return { statusCode: 400, message: 'Invalid password' };
    }
  }
}
