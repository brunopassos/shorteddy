import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthRequestDto } from '../dto/auth-request.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      signIn: jest.fn().mockResolvedValue({ token: 'mockToken', expiresIn: 3600 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return token and expiresIn when signIn is called with valid credentials', async () => {
    const signInDto: AuthRequestDto = { email: 'test@example.com', password: 'password123' };

    const result = await controller.signIn(signInDto);

    expect(result).toEqual({ token: 'mockToken', expiresIn: 3600 });
  });

  it('should call signIn with correct parameters', async () => {
    const signInDto: AuthRequestDto = { email: 'test@example.com', password: 'password123' };

    await controller.signIn(signInDto);

    expect(authService.signIn).toHaveBeenCalledWith(signInDto.email, signInDto.password);
  });
});
