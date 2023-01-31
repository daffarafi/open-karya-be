import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKaryaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString({ each: true })
  tags: string[];
}
