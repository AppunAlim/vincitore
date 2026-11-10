import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { KursusService } from './kursus.service.js';
import { CreateKursusDto } from './dto/create-kursus.dto.js';
import { UpdateKursusDto } from './dto/update-kursus.dto.js';

@Controller('kursus')
export class KursusController {
  constructor(
    private readonly kursusService: KursusService,
  ) {}

  // GET /kursus
  @Get()
  findAll() {
    return this.kursusService.findAll();
  }

  // GET /kursus/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kursusService.findOne(id);
  }

  // POST /kursus
  @Post()
  create(@Body() createKursusDto: CreateKursusDto) {
    return this.kursusService.create(createKursusDto);
  }

  // PATCH /kursus/:id
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateKursusDto: UpdateKursusDto,
  ) {
    return this.kursusService.update(id, updateKursusDto);
  }

  // DELETE /kursus/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kursusService.remove(id);
  }
}