import { Test, TestingModule } from '@nestjs/testing';
import { KursusController } from './kursus.controller.js';
import { KursusService } from './kursus.service.js';

describe('KursusController', () => {
  let controller: KursusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KursusController],
      providers: [KursusService],
    }).compile();

    controller = module.get<KursusController>(KursusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
