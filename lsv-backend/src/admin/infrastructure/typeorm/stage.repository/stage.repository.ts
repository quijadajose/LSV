import { InjectRepository } from "@nestjs/typeorm";
import { CreateStageDto } from "src/admin/application/dtos/create-stage-dto/create-stage-dto";
import { StageRepositoryInterface } from "src/admin/domain/ports/stage.repository.interface/stage.repository.interface";
import { PaginationDto } from "src/shared/application/dtos/PaginationDto";
import { Stages } from "src/shared/domain/entities/stage";
import { Repository } from "typeorm";

export class StageRepository implements StageRepositoryInterface {
     constructor(
        @InjectRepository(Stages)
        private readonly stageRepository: Repository<Stages>,
    ) { }
    findById(id: string): Promise<Stages | null> {
        return this.stageRepository.findOne({ where: { id } });
    }
    findByName(name: string): Promise<Stages | null> {
        return this.stageRepository.findOne({ where: { name } });
    }
    findAll(pagination: PaginationDto): Promise<Stages[]> {
        const { page, limit, orderBy = undefined, sortOrder = undefined } = pagination;

        const skip = (page - 1) * limit;

        const findOptions: any = {
            skip,
            take: limit,
        };

        if (orderBy && sortOrder) {
            findOptions.order = {
                [orderBy]: sortOrder,
            };
        }
        return this.stageRepository.find(findOptions);
    }
    save(stage: Stages): Promise<Stages> {
        return this.stageRepository.save(stage);
    }
    async deleteById(id: string): Promise<void> {
        this.stageRepository.delete(id);
    }
    update(id: string, stage: CreateStageDto): Promise<Stages> {
        this.stageRepository.update(id, stage);
        return this.stageRepository.findOne({ where: { id } });
    }
}
