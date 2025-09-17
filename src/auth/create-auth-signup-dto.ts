import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateAuthSignupDto {
  // Not empty
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  // Not empty, 8 or more characters
  @IsNotEmpty()
  @IsString()
  password: string;
}
