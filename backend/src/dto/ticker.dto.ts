import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class TickerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(16)
  @Matches(/^([a-zA-Z0-9]\.?)+$/s, {
    message: 'ticker can only contain letters, numbers and a period.',
  })
  @Transform(({ value }) => value.toUpperCase())
  ticker: string;
}
