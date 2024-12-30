import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as BaseAuthGuard } from '../auth.guard'
import { Request } from 'express';

@Injectable()
export class OptionalAuthGuard extends BaseAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      request['user'] = null;
      return true;
    }

    try {
      const isValid = await super.canActivate(context);
      return isValid as boolean;
    } catch (error) {
      request['user'] = null;
      return true;
    }
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
