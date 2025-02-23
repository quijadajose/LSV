import { Inject } from '@nestjs/common';
import { QuizRepository } from 'src/quiz/infrastructure/typeorm/quiz.repository/quiz.repository';

export class GetQuizByIdUseCase {
  constructor(
    @Inject('QuizRepositoryInterface')
    private readonly quizRepositoryInterface: QuizRepository,
  ) {}
  execute(quizId: string) {
    return this.quizRepositoryInterface.getQuizById(quizId);
  }
}
