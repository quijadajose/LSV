import { Test, TestingModule } from '@nestjs/testing';
import { StageController } from './stage-admin.controller';

describe('StageAdminController', () => {
  let controller: StageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StageController],
    }).compile();

    controller = module.get<StageController>(StageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
