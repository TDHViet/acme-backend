import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthSignupDto } from './create-auth-signup-dto';
import { SignUpResponse } from './SignUp';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { CreateAuthLoginDTO } from './create-auth-login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async encryptPassword(plainText, saltRounds) {
    return await bcrypt.hash(plainText, saltRounds);
  }
  async decryptPassword(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }
  async signup(payload: CreateAuthSignupDto): Promise<SignUpResponse> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists', {
        cause: new Error(),
        description: 'Duplicate email',
      });
    }
    // save the password in encrypted format - bycrypt
    const hashedPassword = await this.encryptPassword(payload.password, 10);
    // save the user in db with proper field mapping
    return await this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash: hashedPassword,
      },
      select: {
        email: true,
        name: true,
        id: true,
      },
    });
  }
  async login(createAuthLoginDTO: CreateAuthLoginDTO): Promise<{accessToken:string}>{
    // Find user by email
    const user = await this.prisma.user.findFirst({
      where: { email: createAuthLoginDTO.email },
    });
    // If user not found, throw error
    if (!user) {
      throw new UnauthorizedException({
        cause: new Error(),
        description: 'User not found',
      });
    }
    //decrypt the password and compare
    const isPasswordValid = await this.decryptPassword(
      createAuthLoginDTO.password,
      user.passwordHash,
    );
    // if password is invalid, throw error
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        cause: new Error(),
        description: 'Invalid password',
      });
    }
    // return user details (without passwordHash)
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: '1h' },
    );
    return {accessToken};
  }
}