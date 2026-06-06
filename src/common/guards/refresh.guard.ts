import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest()
      const authHeader = request.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid refresh token format')
      }

      const token = authHeader.split(' ')[1]

      try {
        const decoded = jwt.verify(token, 'JWT_REFRESH_SECRET_KEY_2026') as any
        
        request.user = { id: decoded.sub, email: decoded.email, token }
        
        return true
      } catch {
        throw new UnauthorizedException('Refresh session expired or corrupted')
      }
  }
}

