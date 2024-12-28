import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as BaseAuthGuard } from '../auth.guard'

@Injectable()
export class OptionalAuthGuard extends BaseAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      request['user'] = null;
      return true;
    }

    return super.canActivate(context);
  }

  
}
