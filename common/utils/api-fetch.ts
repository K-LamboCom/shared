import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

export interface FetchAPIOptions extends AxiosRequestConfig {
  withAuth?: boolean;
  token?: string;
  baseUrl?: string;
}

@Injectable()
export class ApiFetch {
  constructor(private readonly httpService: HttpService) {}

  async fetchAPI<T = any>(url: string, options?: FetchAPIOptions): Promise<T> {
    const {
      withAuth = false,
      token,
      baseUrl = process.env.API_ENDPOINT,
      ...axiosOptions
    } = options || {};

    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: process.env.API_KEY || '',
    };

    const headers: Record<string, string> = {
      ...baseHeaders,
      ...Object.fromEntries(
        Object.entries(axiosOptions.headers || {}).map(([k, v]) => [
          k,
          String(v),
        ]),
      ),
    };

    if (withAuth) {
      if (!token) throw new UnauthorizedException('Missing access token');
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = baseUrl
      ? `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
      : url;

    try {
      const response = await firstValueFrom(
        this.httpService.request<T>({
          url: fullUrl,
          headers,
          ...axiosOptions,
        }),
      );

      return response.data;
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      throw new UnauthorizedException(
        err.response?.data?.message || 'API request failed',
      );
    }
  }
}
