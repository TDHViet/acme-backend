import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateAuthSignupDto } from './create-auth-signup-dto';
import { AuthService } from './auth.service';
import { CreateAuthLoginDTO } from './create-auth-login-dto';
import { AuthGuard } from './auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/signup
  @Post('/auth/signup')
  async create(@Body() createAuthSignupDto: CreateAuthSignupDto) {
    return await this.authService.signup(createAuthSignupDto);
  }

  // POST /auth/login
  @Post('/auth/login')
  async login(@Body() createAuthLoginDTO: CreateAuthLoginDTO) {
    return await this.authService.login(createAuthLoginDTO);
  }
  // GET /me (authenticated route)
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
