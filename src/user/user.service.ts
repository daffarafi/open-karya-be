import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import { EditUserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getAllUsers() {
    return (await this.userRepository.find({ relations: ['karya'] })).map(
      (user) => {
        delete user.hash;
        return user;
      },
    );
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['karya'],
    });

    delete user.hash;
    return user;
  }

  async editUser(userId: number, dto: EditUserDto) {
    return this.userRepository.update(userId, {
      email: dto.email,
      hash: await argon.hash(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      description: dto.description,
      youtube: dto.youtube,
      github: dto.github,
      twitter: dto.twitter,
      instagram: dto.instagram,
    });
  }
}
