import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApiFetch } from '../utils/api-fetch';
import { AuthSharedService } from './auth-shared.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  // providers: [AuthSharedService, LocalStrategy, JwtStrategy, ApiFetch],
  providers: [AuthSharedService, ApiFetch, JwtStrategy],
  exports: [AuthSharedService, JwtModule],
})
export class AuthSharedModule {}
