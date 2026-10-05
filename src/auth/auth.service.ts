import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService, type PublicUser } from '../users/users.service';
import type { JwtPayload } from './auth.types';
import type { LoginDto } from './dto/login.dto';
import type { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private readonly bcryptRounds: number;
  // Compared against when the email is unknown so both failure paths take the same time.
  private readonly dummyHash: Promise<string>;

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.bcryptRounds = config.getOrThrow<number>('BCRYPT_ROUNDS');
    this.dummyHash = bcrypt.hash('timing-equalizer', this.bcryptRounds);
  }

  async signup({ name, email, password }: SignUpDto): Promise<PublicUser> {
    const passwordHash = await bcrypt.hash(password, this.bcryptRounds);
    try {
      return await this.users.create({ name, email, passwordHash });
    } catch (e) {
      // Rely on the unique index instead of a findFirst pre-check, which races under concurrent signups.
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Email is already registered');
      }
      throw e;
    }
  }

  async login({ email, password }: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.users.findByEmail(email);
    const valid = await bcrypt.compare(password, user?.passwordHash ?? (await this.dummyHash));
    // Same message for unknown email and wrong password to avoid leaking which emails exist.
    if (!user || !valid) throw new UnauthorizedException('Invalid email or password');

    const payload: JwtPayload = { sub: user.id, email: user.email };
    return { accessToken: await this.jwt.signAsync(payload) };
  }
}
