import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { KaryaService } from './karya.service';
import { CreateKaryaDto, EditKaryaDto } from './dto';

@Controller('karya')
export class KaryaController {
  constructor(private karyaService: KaryaService) {}

  @Get()
  getAllKarya() {
    return this.karyaService.getAllKarya();
  }

  @Get(':id')
  getKaryaById(@Param('id', ParseIntPipe) karyaId: number) {
    return this.karyaService.getKaryaById(karyaId);
  }

  @UseGuards(JwtGuard)
  @Post()
  createKarya(@GetUser('id') userId: number, @Body() dto: CreateKaryaDto) {
    return this.karyaService.createKarya(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  editKaryaById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) karyaId: number,
    @Body() dto: EditKaryaDto,
  ) {
    return this.karyaService.editKaryaById(userId, karyaId, dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteKaryaById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) karyaId: number,
  ) {
    return this.karyaService.deleteKaryaById(userId, karyaId);
  }
}
