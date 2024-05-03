import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const { user, token: newToken, roleConfig } = await firstValueFrom(
        this.client.send('auth.verify.user', token),
      );

      if (!roleConfig) {
        throw new ForbiddenException('Invalid role');
      }

      const now = new Date();
      const expiration = new Date(newToken.exp * 1000);
      if (now >= expiration) {
        throw new UnauthorizedException('Token expired');
      }

      request['user'] = user;
      request['token'] = newToken;
      request['roleConfig'] = roleConfig;

      return this.hasRequiredRole(context, roleConfig);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private hasRequiredRole(context: ExecutionContext, roleConfig: any): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    if ( requiredRoles.includes(roleConfig.role) ) {
      return true;
    }


    throw new ForbiddenException('Insufficient permissions');
  }
}