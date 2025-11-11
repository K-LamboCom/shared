import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSharedService } from './auth-shared.service';
import { AuthEntity } from './entities/auth.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1days' },
    }),
    TypeOrmModule.forFeature([AuthEntity]),
  ],
  providers: [AuthSharedService, LocalStrategy, JwtStrategy],
  exports: [AuthSharedService, JwtModule],
})
export class AuthSharedModule {}
