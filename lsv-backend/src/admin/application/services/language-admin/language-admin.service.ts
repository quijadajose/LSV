import { Injectable } from '@nestjs/common';
import { CreateLanguageUseCase } from '../../use-cases/create-language-use-case/create-language-use-case';
import { CreateLanguageDto } from '../../dtos/create-language/create-language';
import { Language } from 'src/shared/domain/entities/language';
import { GetLanguageUseCase } from '../../use-cases/get-language-use-case/get-language-use-case';
import { ListLanguagesUseCase } from '../../use-cases/list-languages-use-case/list-languages-use-case';
import { PaginationDto } from 'src/shared/application/dtos/PaginationDto';

@Injectable()
export class LanguageAdminService {
    constructor(
        private readonly createLanguageUseCase: CreateLanguageUseCase,
        private readonly getLanguageUseCase: GetLanguageUseCase,
        private readonly listLanguagesUseCase: ListLanguagesUseCase,
    ) { }
    async createLanguage(createLanguageDto: CreateLanguageDto): Promise<Language> {
        return this.createLanguageUseCase.execute(createLanguageDto);
    }
    async getLanguage(id: string): Promise<Language> {
        return this.getLanguageUseCase.execute(id);
    }
    async getAllLanguages(pagination: PaginationDto): Promise<Language[]> {
        return this.listLanguagesUseCase.execute(pagination);
    }
}
