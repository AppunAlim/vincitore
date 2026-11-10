import {
  IsString,
  IsIn,
  IsInt,
  Min,
  MinLength,
} from 'class-validator';

export class CreateKursusDto {
  @IsString()
  @MinLength(3)
  nama: string;

  @IsIn(['Pemula', 'Lanjutan'])
  level: string;

  @IsString()
  @MinLength(5)
  jadwal: string;

  @IsInt()
  @Min(1)
  harga: number;

  @IsIn([
    'detail-inggris.html',
    'detail-arab.html',
    'detail-jepang.html',
  ])
  halamanDetail: string;
}