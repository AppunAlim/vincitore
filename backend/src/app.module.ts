import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { KursusModule } from './kursus/kursus.module.js';

@Module({
  imports: [KursusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
