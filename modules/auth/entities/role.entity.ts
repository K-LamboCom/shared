import { Exclude } from 'class-transformer';
import { EntityBase } from 'src/shared/core/entities/entity_base';
import { UserPermission } from 'src/shared/core/enums/user-permission.enum';
import { UserRole } from 'src/shared/core/enums/user-role.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity extends EntityBase {
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
    nullable: true,
  })
  name: UserRole;

  @Column()
  description?: string;

  @Exclude({ toPlainOnly: true })
  @Column('text', { array: true, default: [] })
  permissions: UserPermission[];
}
