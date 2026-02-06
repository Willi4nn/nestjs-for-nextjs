import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Current password is required.' })
  currentPassword: string;

  @IsString({ message: 'New password must be a string.' })
  @IsNotEmpty({ message: 'New password is required.' })
  @MinLength(6, { message: 'New password must be at least 6 characters long.' })
  @MaxLength(64, {
    message: 'New password must be at most 64 characters long.',
  })
  newPassword: string;
}
