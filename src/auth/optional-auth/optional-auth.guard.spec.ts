import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OptionalAuthGuard } from './optional-auth.guard';
import { AuthGuard } from '../auth.guard';

describe('OptionalAuthGuard', () => {
  let guard: OptionalAuthGuard;
  let mockJwtService: Partial<JwtService>;
  let mockConfigService: Partial<ConfigService>;
  let mockCanActivate: jest.SpyInstance;

  beforeEach(() => {
    mockJwtService = {};
    mockConfigService = { get: jest.fn().mockReturnValue('mockSecret') };

    mockCanActivate = jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);

    guard = new OptionalAuthGuard(
      new JwtService(mockJwtService as any),
      new ConfigService(mockConfigService as any),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access and set user to null if no token is provided', async () => {
    const mockRequest: any = { headers: {}, user: undefined };
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockRequest.user).toBeNull();
  });

  it('should call AuthGuard canActivate if token is provided', async () => {
    const mockRequest: any = { headers: { authorization: 'Bearer validToken' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(mockCanActivate).toHaveBeenCalledTimes(1);
    expect(mockCanActivate).toHaveBeenCalledWith(context);
    expect(result).toBe(true);
  });
});
