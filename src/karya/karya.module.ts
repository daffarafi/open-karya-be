import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Karya } from 'src/model/karya.entity';
import { User } from 'src/model/user.entity';
import { KaryaController } from './karya.controller';
import { KaryaService } from './karya.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Karya])],
  controllers: [KaryaController],
  providers: [KaryaService],
})
export class KaryaModule {}
