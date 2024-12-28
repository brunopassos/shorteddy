import { Exclude } from 'class-transformer';

export class CreateUserDto {
  email: string;
  password: string;
}

export class UserDto {
  id: string;
  email: string;
  @Exclude()
  password: string;
  is_active: boolean;
}
