import { Exclude } from 'class-transformer';
import { EntityBase } from 'src/shared/core/entities/entity_base';
import { UserStatus } from 'src/shared/core/enums/user-status.enum';

import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'auth' })
@Unique(['username', 'email'])
export class AuthEntity extends EntityBase {
  @Column()
  @Index({ unique: true })
  username: string;

  @Column({ name: 'password' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;
}
