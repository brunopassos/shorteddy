import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import { hashSync as bcryptHashSync, compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ){}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {

    const userAlreadyExists = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })

    if(userAlreadyExists){
      throw new HttpException(`User already exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser: UserEntity = {
      id: randomUUID(),
      email: createUserDto.email,
      password: bcryptHashSync(createUserDto.password, 10),
      is_active: true
    }

    await this.usersRepository.save(newUser)

    return plainToClass(UserEntity, newUser);
  }

  async findOne(id: string): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findOne({
      where:{
        id
      }
    })

    if (!foundUser) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    return plainToClass(UserEntity, foundUser);
  }

  async findByEmail(email: string, pass: string): Promise<UserEntity>  {
    const foundUser = await this.usersRepository.findOne({
      where:{
        email
      }
    })

    const invalidCredentialsMessage = 'Invalid email or password!';

    if (!foundUser) {
      throw new HttpException(
        invalidCredentialsMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatches = compareSync(pass, foundUser.password);

    if (!passwordMatches) {
      throw new HttpException(
        invalidCredentialsMessage,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const userFound = await this.usersRepository.findOne({
      where:{
        id
      }
    })

    if (!userFound) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    userFound.email = updateUserDto.email ?? userFound.email
    userFound.password = updateUserDto.password ? bcryptHashSync(updateUserDto.password, 10) : userFound.password

    await this.usersRepository.update(userFound.id, userFound)

    return userFound;
  }

  async remove(id: string): Promise<void> {
    const foundUser = await this.usersRepository.findOne({
      where:{
        id
      }
    })

    if (!foundUser) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.delete(id)
  }
}
