import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateKursusDto } from './dto/create-kursus.dto.js';
import { UpdateKursusDto } from './dto/update-kursus.dto.js';

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export class KursusService {
  constructor(private prisma: PrismaService) {}

  // READ Mengambil seluruh kursus
  async findAll() {
    return this.prisma.kursus.findMany();
  }

  // READ Mengambil satu kursus
  async findOne(id: string) {
    const kursus = await this.prisma.kursus.findUnique({
      where: { id },
    });

    if (!kursus) {
      throw new NotFoundException(
        `Kursus dengan ID ${id} tidak ditemukan`,
      );
    }

    return kursus;
  }

  // CREATE Menambahkan kursus
  async create(createKursusDto: CreateKursusDto) {
    const duplikat = await this.prisma.kursus.findFirst({
      where: {
        nama: createKursusDto.nama,
        level: createKursusDto.level,
        jadwal: createKursusDto.jadwal,
      },
    });

    if (duplikat) {
      throw new ConflictException(
        'Kursus dengan nama, level, dan jadwal tersebut sudah tersedia',
      );
    }

    return this.prisma.kursus.create({
      data: createKursusDto,
    });
  }

  // UPDATE Mengubah kursus
  async update(
    id: string,
    updateKursusDto: UpdateKursusDto,
  ) {
    const kursus = await this.findOne(id);

    const duplikat = await this.prisma.kursus.findFirst({
      where: {
        id: { not: id },
        nama: updateKursusDto.nama ?? kursus.nama,
        level: updateKursusDto.level ?? kursus.level,
        jadwal: updateKursusDto.jadwal ?? kursus.jadwal,
      },
    });

    if (duplikat) {
      throw new ConflictException(
        'Kursus dengan nama, level, dan jadwal tersebut sudah tersedia',
      );
    }

    return this.prisma.kursus.update({
      where: { id },
      data: updateKursusDto,
    });
  }

  // DELETE Menghapus kursus
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.kursus.delete({
      where: { id },
    });
  }

  async getLevel() {
  const totalKursus = await this.prisma.kursus.count();

  const kursusPemula = await this.prisma.kursus.count({
    where: {
      level: 'Pemula',
    },
  });

  const kursusLanjutan = await this.prisma.kursus.count({
    where: {
      level: 'Lanjutan',
    },
  });

  return {
    totalKursus,
    kursusPemula,
    kursusLanjutan,
  };
}
}
