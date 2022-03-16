import { IsOptional, Matches } from 'class-validator';

export class AnalyticsDto {
  @Matches(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, {
    message: 'Invalid since date. Must be in format DD/MM/YYYY',
  })
  @IsOptional()
  since?: string;

  @Matches(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/, {
    message: 'Invalid until date. Must be in format DD/MM/YYYY',
  })
  @IsOptional()
  until?: string;
}
