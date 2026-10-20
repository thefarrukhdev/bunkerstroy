import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@bunkerstroy/db';

export interface CurrentUserPayload {
  id: string;
  role: Role;
  inn?: string | null;
  companyName?: string | null;
  phone?: string | null;
  email?: string | null;
  displayName?: string | null;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserPayload | undefined;
    if (!user) return null;
    return data ? user[data] : user;
  }
);
