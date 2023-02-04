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
    const karya = await this.karyaRepository.find({ relations: ['user'] });
    const removedHashKarya = karya.map((karya) => {
      delete karya.user.hash;
      return karya;
    });
    return {
      statusCode: 200,
      message: 'success!',
      karya: removedHashKarya,
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
    return {
      statusCode: 200,
      message: 'success!',
      karya,
    };
  }

  async createKarya(userId: number, dto: CreateKaryaDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    delete user.hash;
    const karya = await this.karyaRepository.save({ ...dto, user });
    return {
      statusCode: 201,
      message: 'Karya berhasil diunggah!',
      karya,
    };
  }

  async editKaryaById(userId: number, karyaId: number, dto: EditKaryaDto) {
    const { karya } = await this.getKaryaById(karyaId);

    if (!karya || karya.user.id !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.karyaRepository.update(karya.id, dto);
    const updatedKarya = await this.getKaryaById(karyaId);

    return {
      statusCode: 200,
      message: 'Karya berhasil diupdate!',
      karya: updatedKarya,
    };
  }

  async deleteKaryaById(userId: number, karyaId: number) {
    const { karya } = await this.getKaryaById(karyaId);

    if (!karya || karya.user.id !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.karyaRepository.delete(karyaId);

    return {
      statusCode: 200,
      message: 'Karya berhasil dihapus!',
    };
  }
}
