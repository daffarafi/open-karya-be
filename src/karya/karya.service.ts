import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Karya } from 'src/model/karya.entity';
import { User } from 'src/model/user.entity';
import { Repository } from 'typeorm';
import { CreateKaryaDto, EditKaryaDto } from './dto';

@Injectable()
export class KaryaService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Karya)
    private readonly karyaRepository: Repository<Karya>,
  ) {}

  async getAllKarya() {
    return {
      karya: (await this.karyaRepository.find({ relations: ['user'] })).map(
        (karya) => {
          delete karya.user.hash;
          return karya;
        },
      ),
    };
  }

  async getKaryaById(karyaId: number) {
    const karya = await this.karyaRepository.findOne({
      where: {
        id: karyaId,
      },
      relations: ['user'],
    });

    delete karya.user.hash;
    return karya;
  }

  async createKarya(userId: number, dto: CreateKaryaDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    delete user.hash;
    const karya = await this.karyaRepository.save({ ...dto, user });
    return karya;
  }

  async editKaryaById(userId: number, karyaId: number, dto: EditKaryaDto) {
    const karya = await this.getKaryaById(karyaId);

    if (!karya || karya.user.id !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.karyaRepository.update(karya.id, dto);
  }

  async deleteKaryaById(userId: number, karyaId: number) {
    const karya = await this.getKaryaById(karyaId);

    if (!karya || karya.user.id !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.karyaRepository.delete(karyaId);
  }
}
