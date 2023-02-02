import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  private GOOGLE_CLIENT_ID: string;

  constructor(private configService: ConfigService) {
    this.GOOGLE_CLIENT_ID = this.configService.get<string>('GOOGLE_CLIENT_ID');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = new OAuth2Client(this.GOOGLE_CLIENT_ID);
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      const ticket = await client.verifyIdToken({
        idToken: token,
      });

      req.user = {
        sub: ticket.getPayload()['sub'],
      };

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
