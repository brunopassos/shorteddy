import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import { hashSync as bcryptHashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  private users: UserDto[] = [];

  create(createUserDto: CreateUserDto): UserDto {
    const foundUser = this.users.find(
      (user) => createUserDto.email === user.email,
    );

    if (foundUser) {
      throw new HttpException(`User already exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser: UserDto = {
      id: randomUUID(),
      email: createUserDto.email,
      password: bcryptHashSync(createUserDto.password, 10),
      is_active: true,
    };

    this.users.push(newUser);

    return newUser;
  }

  findAll(): UserDto[] {
    return this.users;
  }

  findOne(id: string): UserDto {
    const foundUser = this.users.find((user) => user.id === id);

    if (!foundUser) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    return foundUser;
  }

  findByEmail(email: string, pass: string) {
    const userFound = this.users.find((user) => user.email === email);

    const invalidCredentialsMessage = 'Invalid username or password!';

    if (!userFound) {
      throw new HttpException(
        invalidCredentialsMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatches = compareSync(pass, userFound.password);

    if (!passwordMatches) {
      throw new HttpException(
        invalidCredentialsMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return userFound;
  }

  update(id: string, updateUserDto: UpdateUserDto): UserDto {
    const foundUserIndex = this.users.findIndex((user) => user.id === id);

    if (foundUserIndex === -1) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    const updatedUser: UserDto = {
      id: this.users[foundUserIndex].id,
      email: updateUserDto.email
        ? updateUserDto.email
        : this.users[foundUserIndex].email,
      password: updateUserDto.password
        ? bcryptHashSync(updateUserDto.password, 10)
        : this.users[foundUserIndex].password,
      is_active: this.users[foundUserIndex].is_active,
    };

    this.users.splice(foundUserIndex, 1, updatedUser);

    return updatedUser;
  }

  remove(id: string): void {
    const foundUserIndex = this.users.findIndex((user) => user.id === id);

    if (foundUserIndex === -1) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    this.users[foundUserIndex].is_active = false;
  }
}
