import { PartialType } from '@nestjs/mapped-types';
import { CreateKursusDto } from './create-kursus.dto.js';

export class UpdateKursusDto extends PartialType(CreateKursusDto) {}
