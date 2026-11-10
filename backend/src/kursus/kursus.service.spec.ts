import { Test, TestingModule } from '@nestjs/testing';
import { KursusService } from './kursus.service.js';

describe('KursusService', () => {
  let service: KursusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KursusService],
    }).compile();

    service = module.get<KursusService>(KursusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
