import { SetMetadata } from '@nestjs/common';
import { UserPermission } from 'src/shared/core/enums/user-permission.enum';
import { UserRole } from 'src/shared/core/enums/user-role.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Roles = (...Roles: UserRole[]) => SetMetadata(ROLES_KEY, Roles);

export const RequirePermissions = (...Permissions: UserPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, Permissions);
