import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { usersEntityMock } from '../__mock__/users.mock';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<UserEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersRepository).toBeDefined()
  });

  describe('UsersService - create', () => {
    beforeAll(() => {
      jest.spyOn(crypto, 'randomUUID').mockReturnValue('123e4567-e89b-12d3-a456-426614174000');
    });
  
    beforeEach(() => {
      jest.spyOn(bcrypt, 'hashSync').mockImplementation(() => 'mocked-hashed-password');
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it('should create a new user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(usersRepository, 'save').mockResolvedValueOnce({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'bruno@mail.com',
        password: 'mocked-hashed-password',
        is_active: true,
      });
  
      const result = await service.create({
        email: 'bruno@mail.com',
        password: '123456',
      });
  
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'bruno@mail.com',
        password: 'mocked-hashed-password',
        is_active: true,
      });
    });
  
    it('should throw an exception if user already exists', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(usersEntityMock);
  
      await expect(
        service.create({ email: 'bruno@mail.com', password: '123456' }),
      ).rejects.toThrow(new HttpException('User already exists', HttpStatus.BAD_REQUEST));
    });
  });
  
  
  describe('findAll', () => {
    it('should return a list of users', async () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce([usersEntityMock]);

      const result = await service.findAll();

      expect(result).toEqual([usersEntityMock]);
    });
  });

  
  describe('findOne', () => {
    it('should return a user by ID', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(usersEntityMock);

      const result = await service.findOne('some-uuid');

      expect(result).toEqual(usersEntityMock);
    });

    it('should throw an exception if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });

    it('Should return a user by ID - TESTE', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(usersEntityMock)

      const result = await service.findOne('some-uuid')

      expect(result).toEqual(usersEntityMock)
    })
  });

  describe('findByEmail', () => {
    it('should return a user with correct email and password', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(usersEntityMock);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true);

      const result = await service.findByEmail('bruno@mail.com', '123456');

      expect(result).toEqual(usersEntityMock);
    });

    it('should throw an exception if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findByEmail('invalid@mail.com', '123456')).rejects.toThrow(
        new HttpException('Invalid email or password!', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an exception if password is incorrect', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(usersEntityMock);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

      await expect(service.findByEmail('bruno@mail.com', 'wrong_password')).rejects.toThrow(
        new HttpException('Invalid email or password!', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(usersEntityMock);
      jest.spyOn(usersRepository, 'update').mockResolvedValueOnce(null);

      const result = await service.update('some-uuid', {
        email: 'new@mail.com',
        password: 'new_password',
      });

      expect(result).toEqual({
        ...usersEntityMock,
        email: 'new@mail.com',
        password: expect.any(String),
      });
    });

    it('should throw an exception if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.update('invalid-id', { email: 'new@mail.com', password: 'new_password' }),
      ).rejects.toThrow(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(usersEntityMock);
      jest.spyOn(usersRepository, 'delete').mockResolvedValueOnce(null);

      const result = await service.remove('some-uuid');

      expect(result).toBeUndefined(); 
    });

    it('should throw an exception if user is not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
