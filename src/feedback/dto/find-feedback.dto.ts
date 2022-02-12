import { IsOptional, Matches } from 'class-validator';

export class FindFeedbackDto {
  @Matches(/created|worseStars|bestStars/, { message: 'Invalid order type' })
  @IsOptional()
  order: 'created' | 'worseStars' | 'bestStars';

  @IsOptional()
  stars: number;
}
