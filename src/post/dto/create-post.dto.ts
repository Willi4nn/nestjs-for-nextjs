import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Title needs to be a string' })
  @Length(10, 150, {
    message: 'Title needs to be between 10 and 150 characters',
  })
  title: string;

  @IsString({ message: 'Excerpt needs to be a string' })
  @Length(10, 200, {
    message: 'Excerpt needs to be between 10 and 200 characters',
  })
  excerpt: string;

  @IsString({ message: 'Content needs to be a string' })
  @IsNotEmpty({ message: 'Content cannot be empty' })
  content: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  coverImageUrl?: string;
}
