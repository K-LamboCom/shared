import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiFetch } from '../utils/api-fetch';

@Injectable()
export class AuthSharedService {
  constructor(private readonly apiFetch: ApiFetch) {}

  async getMe(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const data = await this.apiFetch.fetchAPI('/auth/validate-token', {
        baseUrl: (
          process.env.AUTH_SERVICE || 'http://localhost:50051/api/v1'
        ).trim(),
        method: 'GET',
        withAuth: true,
        token,
      });
      return data;
    } catch (err) {
      console.error('GetMe error:', err.response || err);
      throw new UnauthorizedException('Cannot find User');
    }
  }
}
