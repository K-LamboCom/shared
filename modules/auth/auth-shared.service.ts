import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/shared/common/services/base.service';
import { PasswordUtil } from 'src/shared/common/utils/password.util';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthSharedService extends BaseService<AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super(authRepository);
  }

  async validate(
    username: string,
    password: string,
  ): Promise<AuthEntity | null> {
    const user = await this.authRepository.findOne({
      where: { username: username },
      relations: ['role'],
    });

    if (!user) return null;

    const isPasswordValid = await PasswordUtil.compare(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }

  async findByUsername(username: string) {
    return await this.authRepository.findOne({
      where: { username: username },
      relations: ['role'],
    });
  }

  async getMe(auth: AuthEntity): Promise<AuthEntity> {
    const user = await this.findOne({
      where: { id: auth.id },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Cannot find User');
    }
    return user;
  }
}
