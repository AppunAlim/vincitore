import { Module } from '@nestjs/common';
import { KursusService } from './kursus.service.js';
import { KursusController } from './kursus.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [KursusController],
  providers: [KursusService],
})
export class KursusModule {}