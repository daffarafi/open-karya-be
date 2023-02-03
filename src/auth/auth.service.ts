import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/model/user.entity';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto';
import { LoginDto } from './dto';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: RegisterDto) {
    const isExist = await this.userRepository.findOneBy({ email: dto.email });

    if (isExist) {
      throw new ForbiddenException('Credentials taken');
    }

    const user = await this.userRepository.save({
      email: dto.email,
      hash: await argon.hash(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      description: dto.description,
      karya: [],
      youtube: dto.youtube,
      github: dto.github,
      twitter: dto.twitter,
      instagram: dto.instagram,
    });

    delete user.hash;

    return {
      user,
      access_token: await this.generateToken(user.id, user.email),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: dto.email });

    if (!user) {
      throw new ForbiddenException('Credentials invalid');
    }

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Credentials invalid');
    }

    delete user.hash;

    return {
      user,
      access_token: await this.generateToken(user.id, user.email),
    };
  }

  async generateToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret,
    });

    return token;
  }
}
