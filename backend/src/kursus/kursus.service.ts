import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { Kursus } from './entities/kursus.entity.js';
import { CreateKursusDto } from './dto/create-kursus.dto.js';
import { UpdateKursusDto } from './dto/update-kursus.dto.js';

@Injectable()
export class KursusService {
  private daftarKursus: Kursus[] = [
    {
      id: '1',
      nama: 'Bahasa Inggris',
      level: 'Pemula',
      jadwal: 'Senin & Rabu, 19.00',
      harga: 199999,
      halamanDetail: 'detail-inggris.html',
    },
    {
      id: '2',
      nama: 'Bahasa Inggris',
      level: 'Lanjutan',
      jadwal: 'Selasa & Kamis, 19.00',
      harga: 249999,
      halamanDetail: 'detail-inggris.html',
    },
    {
      id: '3',
      nama: 'Bahasa Arab',
      level: 'Pemula',
      jadwal: 'Sabtu, 09.00',
      harga: 199999,
      halamanDetail: 'detail-arab.html',
    },
    {
      id: '4',
      nama: 'Bahasa Jepang',
      level: 'Pemula',
      jadwal: 'Minggu, 09.00',
      harga: 199999,
      halamanDetail: 'detail-jepang.html',
    },
  ];

  // READ: Mengambil seluruh kursus
  findAll(): Kursus[] {
    return this.daftarKursus;
  }

  // READ: Mengambil satu kursus
  findOne(id: string): Kursus {
    const kursus = this.daftarKursus.find(
      (item) => item.id === id,
    );

    if (!kursus) {
      throw new NotFoundException(
        `Kursus dengan ID ${id} tidak ditemukan`,
      );
    }

    return kursus;
  }

  // CREATE: Menambahkan kursus
  create(createKursusDto: CreateKursusDto): Kursus {
    const duplikat = this.daftarKursus.some(
      (item) =>
        item.nama === createKursusDto.nama &&
        item.level === createKursusDto.level &&
        item.jadwal === createKursusDto.jadwal,
    );

    if (duplikat) {
      throw new ConflictException(
        'Kursus dengan nama, level, dan jadwal tersebut sudah tersedia',
      );
    }

    const idBerikutnya =
      Math.max(
        0,
        ...this.daftarKursus.map((item) => Number(item.id)),
      ) + 1;

    const kursusBaru: Kursus = {
      id: String(idBerikutnya),
      ...createKursusDto,
    };

    this.daftarKursus.push(kursusBaru);

    return kursusBaru;
  }

  // UPDATE: Mengubah kursus
  update(
    id: string,
    updateKursusDto: UpdateKursusDto,
  ): Kursus {
    const kursus = this.findOne(id);

    const duplikat = this.daftarKursus.some(
      (item) =>
        item.id !== id &&
        item.nama === (updateKursusDto.nama ?? kursus.nama) &&
        item.level === (updateKursusDto.level ?? kursus.level) &&
        item.jadwal === (updateKursusDto.jadwal ?? kursus.jadwal),
    );

    if (duplikat) {
      throw new ConflictException(
        'Kursus dengan nama, level, dan jadwal tersebut sudah tersedia',
      );
    }

    Object.assign(kursus, updateKursusDto);

    return kursus;
  }

  // DELETE: Menghapus kursus
  remove(id: string): Kursus {
    const kursus = this.findOne(id);

    this.daftarKursus = this.daftarKursus.filter(
      (item) => item.id !== id,
    );

    return kursus;
  }
}