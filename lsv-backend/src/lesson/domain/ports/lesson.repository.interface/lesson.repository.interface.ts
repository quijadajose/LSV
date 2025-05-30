import { CreateLessonDto } from 'src/lesson/domain/dto/create-lesson/create-lesson-dto';
import { PaginationDto } from 'src/shared/domain/dto/PaginationDto';
import { Lesson } from 'src/shared/domain/entities/lesson';

export interface LessonRepositoryInterface {
  findById(id: string): Promise<Lesson | null>;
  findByNameInLanguage(
    name: string,
    languageId: string,
  ): Promise<Lesson | null>;
  findAll(pagination: PaginationDto): Promise<Lesson[]>;
  save(lesson: Lesson): Promise<Lesson>;
  deleteById(id: string): Promise<void>;
  update(id: string, language: CreateLessonDto): Promise<Lesson>;
  getLessonsByLanguage(
    languageId: string,
    pagination: PaginationDto,
  ): Promise<Lesson[]>;
}
