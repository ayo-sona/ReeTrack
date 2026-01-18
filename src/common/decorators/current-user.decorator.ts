import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return {
      id: request.user?.sub,
      email: request.user?.email,
      role: request.user?.role,
      currentOrganization: request.user?.currentOrganization,
    };
  },
);
