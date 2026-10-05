import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // GET /me — the token is valid, but the account may have been deleted since it was issued.
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    const profile = await this.users.findPublicById(user.id);
    if (!profile) throw new UnauthorizedException();
    return profile;
  }
}
