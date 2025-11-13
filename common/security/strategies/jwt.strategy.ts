import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      // passReqToCallback: true,
    });
  }

  validate(payload: any): Promise<any> {
    return payload;
  }

  ///// validate-token with auth service //////////////

  // async validate(req: Request, payload: any): Promise<any> {
  //   const authHeader = req.headers['authorization'] || '';
  //   const token = authHeader.replace('Bearer ', '');

  //   const res = await this.client.post(
  //     '/validate-token',
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   );

  //   if (
  //     res.data?.statusCode === 201 &&
  //     res.data?.data &&
  //     res.data?.data?.username == payload?.username
  //   ) {
  //     return res.data.data;
  //   }

  //   throw new UnauthorizedException('Invalid token');
  // }

  // private client = axios.create({
  //   baseURL: 'https://localhost:50051/api/v1/auth',
  //   httpsAgent,
  // });
}
