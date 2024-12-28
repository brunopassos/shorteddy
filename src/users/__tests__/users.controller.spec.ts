import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { usersEntityMock } from '../__mock__/users.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created user', async () => {
      const userDto: CreateUserDto = { email: 'test@mail.com', password: '123456' };
      jest.spyOn(service, 'create').mockResolvedValueOnce(usersEntityMock);

      const result = await controller.create(userDto);

      expect(service.create).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(usersEntityMock);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return a list of users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([usersEntityMock]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([usersEntityMock]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return a user', async () => {
      const userId = 'some-uuid';
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(usersEntityMock);

      const result = await controller.findOne(userId);

      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(usersEntityMock);
    });
  });

  describe('update', () => {
    it('should call service.update and return the updated user', async () => {
      const userId= 'some-uuid';
      const userDto: UpdateUserDto = { email: 'updated@mail.com', password: 'new_password' };
      const updatedUser = { ...usersEntityMock, ...userDto };
      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedUser);

      const result = await controller.update(userId, userDto);

      expect(service.update).toHaveBeenCalledWith(userId, userDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return undefined', async () => {
      const userId = 'some-uuid';
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      const result = await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });
});