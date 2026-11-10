import { Module } from '@nestjs/common';
import { KursusService } from './kursus.service.js';
import { KursusController } from './kursus.controller.js';

@Module({
  controllers: [KursusController],
  providers: [KursusService],
})
export class KursusModule {}
