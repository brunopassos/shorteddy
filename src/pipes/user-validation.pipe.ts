import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class UserValidationPipe implements PipeTransform {
  transform(value: CreateUserDto) {
    if (!this.isValidEmail(value.email)) {
      throw new BadRequestException('The email provided is not valid');
    }
    
    if (!this.isValidPassword(value.password)) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    return value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }
}
