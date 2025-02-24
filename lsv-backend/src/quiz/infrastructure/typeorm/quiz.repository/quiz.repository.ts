import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizDto } from 'src/quiz/application/dtos/quiz-dto/quiz-dto';
import { SubmissionDto } from 'src/quiz/application/dtos/submission-dto/submission-dto';
import { QuizRepositoryInterface } from 'src/quiz/domain/ports/quiz.repository.interface/quiz.repository.interface';
import { PaginationDto } from 'src/shared/application/dtos/PaginationDto';
import { Lesson } from 'src/shared/domain/entities/lesson';
import { Option } from 'src/shared/domain/entities/option';
import { Question } from 'src/shared/domain/entities/question';
import { Quiz } from 'src/shared/domain/entities/quiz';
import { QuizSubmission } from 'src/shared/domain/entities/quizSubmission';
import { User } from 'src/shared/domain/entities/user';
import { FindManyOptions, Repository } from 'typeorm';

export class QuizRepository implements QuizRepositoryInterface {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(QuizSubmission)
    private readonly submissionRepository: Repository<QuizSubmission>,
  ) {}
  findById(id: string): Promise<Quiz | null> {
    return this.quizRepository.findOne({ where: { id } });
  }
  findAll(pagination: PaginationDto): Promise<Quiz[]> {
    const {
      page,
      limit,
      orderBy = undefined,
      sortOrder = undefined,
    } = pagination;

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
    return this.quizRepository.find(findOptions);
  }
  save(quiz: Quiz): Promise<Quiz> {
    return this.quizRepository.save(quiz);
  }
  async deleteById(id: string): Promise<void> {
    await this.quizRepository.delete(id);
  }
  update(id: string, quiz: QuizDto): Promise<Quiz> {
    this.quizRepository.update(id, quiz);
    return this.quizRepository.findOne({ where: { id } });
  }

  async saveWithQuestionsAndOptions(quizDto: QuizDto): Promise<Quiz> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: quizDto.lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const quiz = this.quizRepository.create({ lesson });

    const savedQuiz = await this.quizRepository.save(quiz);

    const questions = await Promise.all(
      quizDto.questions.map(async (q) => {
        const question = this.questionRepository.create({
          text: q.text,
          quiz: savedQuiz,
        });
        const savedQuestion = await this.questionRepository.save(question);

        const options = await Promise.all(
          q.options.map(async (o) => {
            const option = this.optionRepository.create({
              text: o.text,
              isCorrect: o.isCorrect,
              question: savedQuestion,
            });
            return this.optionRepository.save(option);
          }),
        );

        savedQuestion.options = options;
        return savedQuestion;
      }),
    );

    savedQuiz.questions = questions;
    return savedQuiz;
  }

  listQuizzesByLanguageId(
    languageId: string,
    pagination: PaginationDto,
  ): Promise<Quiz[]> {
    const {
      page,
      limit,
      orderBy = undefined,
      sortOrder = undefined,
    } = pagination;

    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions = {
      where: {
        lesson: {
          language: {
            id: languageId,
          },
        },
      },
      relations: ['lesson', 'lesson.language'],
      skip,
      take: limit,
    };

    if (orderBy && sortOrder) {
      findOptions.order = {
        [orderBy]: sortOrder,
      };
    }
    return this.quizRepository.find(findOptions);
  }

  getQuizById(quizId: string): Promise<Quiz> {
    return this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['lesson', 'questions', 'questions.options'],
      select: {
        id: true,
        lesson: {
          id: true,
          name: true,
        },
        questions: {
          id: true,
          text: true,
          options: {
            id: true,
            text: true,
          },
        },
      },
    });
  }
  async submissionTest(user: User, quiz: Quiz, submissionDto: SubmissionDto) {
    const correctOptions = await this.optionRepository.find({
      where: {
        question: {
          quiz: { id: quiz.id },
        },
        isCorrect: true,
      },
      relations: ['question'],
    });

    const correctAnswersMap = new Map<string, string>(); // questionId -> optionId
    correctOptions.forEach((option) => {
      correctAnswersMap.set(option.question.id, option.id);
    });

    let correctCount = 0;
    for (const submission of submissionDto.answers) {
      if (
        correctAnswersMap.get(submission.questionId) === submission.optionId
      ) {
        correctCount++;
      }
    }

    const totalQuestions = correctOptions.length;
    const score =
      totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const submission = this.submissionRepository.create({
      user: user,
      quiz: quiz,
      answers: JSON.stringify(submissionDto.answers) as any,
      score: Math.round(score),
    });
    const savedSubmission = await this.submissionRepository.save(submission);
    const { id, submittedAt } = savedSubmission;
    return { id, submittedAt, score };
  }
  getSubmissionsByUserId(
    user: User,
    quiz: Quiz,
    pagination: PaginationDto,
  ): Promise<QuizSubmission[]> {
    const {
      page,
      limit,
      orderBy = undefined,
      sortOrder = undefined,
    } = pagination;

    const skip = (page - 1) * limit;

    const findOptions: FindManyOptions = {
      where: {
        quiz: { id: quiz.id },
        user: { id: user.id },
      },
      skip,
      take: limit,
    };

    if (orderBy && sortOrder) {
      findOptions.order = {
        [orderBy]: sortOrder,
      };
    }

    return this.submissionRepository.find(findOptions);
  }
}
