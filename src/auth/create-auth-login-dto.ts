import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateAuthLoginDTO {
    // Not empty
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  // Not empty, 8 or more characters
  @IsNotEmpty()
  @IsString()
  password: string;
}