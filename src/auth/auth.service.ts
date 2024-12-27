import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, pass: string): Promise<AuthResponseDto> {
    const user = this.usersService.findByEmail(email, pass);
    const payload = { sub: user.id, username: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
      expiresIn: +this.configService.get<number>('EXPIRES_IN'),
    };
  }
}
