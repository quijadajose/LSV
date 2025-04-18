import { LeaderboardDto } from 'src/leaderboard/domain/dto/leaderboard/leaderboard';
import { QuizDto } from 'src/quiz/domain/dto/quiz/quiz-dto';
import { PaginationDto } from 'src/shared/domain/dto/PaginationDto';
import { Quiz } from 'src/shared/domain/entities/quiz';
import { QuizSubmission } from 'src/shared/domain/entities/quizSubmission';
import { User } from 'src/shared/domain/entities/user';

export interface QuizRepositoryInterface {
  findById(id: string): Promise<Quiz | null>;
  findAll(pagination: PaginationDto): Promise<Quiz[]>;
  save(quiz: Quiz): Promise<Quiz>;
  deleteById(id: string): Promise<void>;
  update(id: string, quiz: QuizDto): Promise<Quiz>;
  saveWithQuestionsAndOptions(quizDto: QuizDto): Promise<Quiz>;
  listQuizzesByLanguageId(
    languageId: string,
    pagination: PaginationDto,
  ): Promise<Quiz[]>;
  getSubmissionsByUserId(
    user: User,
    quiz: Quiz,
    pagination: PaginationDto,
  ): Promise<QuizSubmission[]>;
  getLeaderboard(pagination: PaginationDto): Promise<LeaderboardDto[]>;
  getLeaderboardByLanguageId(
    languageId: string,
    pagination: PaginationDto,
  ): Promise<LeaderboardDto[]>;
  getQuizById(quizId: string): Promise<Quiz>;
}
