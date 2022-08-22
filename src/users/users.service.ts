import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  async findOne(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    try {
      return await this.userRepository.findOneByOrFail(where);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne({ id });
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.findOne({ id });
    await this.userRepository.softDelete({ id });
  }
}
