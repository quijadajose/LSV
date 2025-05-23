import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { QuizDto } from '../../../domain/dto/quiz/quiz-dto';
import { CreateQuizWithQuestionsAndOptionsUseCase } from '../../use-cases/create-quiz-with-questions-and-options-use-case/create-quiz-with-questions-and-options-use-case';
import { PaginationDto } from 'src/shared/domain/dto/PaginationDto';
import { listQuizzesByLanguageIdUseCase } from '../../use-cases/list-quizzes-by-language-use-case/list-quizzes-by-language-use-case';
import { GetQuizByIdUseCase } from '../../use-cases/get-quiz-by-id-use-case/get-quiz-by-id-use-case';
import { SubmissionTestUseCase } from '../../use-cases/submission-test-use-case/submission-test-use-case';
import { SubmissionDto } from '../../dto/submission/submission-dto';
import { GetUserByIdUseCase } from 'src/users/application/use-cases/get-user-by-id-use-case/get-user-by-id-use-case';
import { GetSubmissionTestFromUserUseCase } from '../../use-cases/get-submission-test-from-user-use-case/get-submission-test-from-user-use-case';

@Injectable()
export class QuizService {
  constructor(
    private readonly createQuizWithQuestionsAndOptionsUseCase: CreateQuizWithQuestionsAndOptionsUseCase,
    private readonly listQuizzesUseCase: listQuizzesByLanguageIdUseCase,
    private readonly getQuizByIdUseCase: GetQuizByIdUseCase,
    private readonly submissionTestUseCase: SubmissionTestUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getSubmissionTestFromUserUseCase: GetSubmissionTestFromUserUseCase,
  ) {}
  createQuiz(quizDto: QuizDto) {
    return this.createQuizWithQuestionsAndOptionsUseCase.execute(quizDto);
  }
  listQuizzesByLanguageId(
    languageId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.listQuizzesUseCase.execute(languageId, pagination);
  }
  getQuizById(quizId: string) {
    return this.getQuizByIdUseCase.execute(quizId);
  }
  async submissionTest(
    userId: string,
    quizId: string,
    submission: SubmissionDto,
  ) {
    if (!userId || !quizId) {
      throw new BadRequestException('User ID and Quiz ID are required.');
    }

    const user = await this.getUserByIdUseCase.execute(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const quiz = await this.getQuizByIdUseCase.execute(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found.');
    }

    return this.submissionTestUseCase.execute(user, quiz, submission);
  }
  async getQuizSubmissionTestFromUser(
    userId: string,
    quizId: string,
    pagination: PaginationDto,
  ) {
    if (!userId || !quizId) {
      throw new BadRequestException('User ID and Quiz ID are required.');
    }

    const user = await this.getUserByIdUseCase.execute(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const quiz = await this.getQuizByIdUseCase.execute(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz not found.');
    }
    return this.getSubmissionTestFromUserUseCase.execute(
      user,
      quiz,
      pagination,
    );
  }
}
