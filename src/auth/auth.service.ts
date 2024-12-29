import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
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
    const user = await this.usersService.findByEmail(email, pass);

    const invalidCredentialsMessage = 'Invalid email or password!';
    
    if (!user) {
      throw new HttpException(
        invalidCredentialsMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    const payload = { sub: user.id, username: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
      expiresIn: +this.configService.get<number>('EXPIRES_IN'),
    };
  }
}
