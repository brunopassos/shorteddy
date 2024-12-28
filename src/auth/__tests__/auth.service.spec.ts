import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from '../dto/auth-response.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(3600),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token and expiration time on success', async () => {
      const email = 'test@example.com';
      const pass = 'password';
      const user = { id: 'user123', email: 'test@example.com' };
      const token = 'mockToken';

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue(token);

      const result: AuthResponseDto = await service.signIn(email, pass);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email, pass);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: user.id, username: user.email });
      expect(result).toEqual({
        token,
        expiresIn: 3600,
      });
    });

    it('should throw an error if the user is not found', async () => {
      const email = 'test@example.com';
      const pass = 'wrongPassword';

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(email, pass)).rejects.toThrow('Invalid email or password!');
    });
  });
});
