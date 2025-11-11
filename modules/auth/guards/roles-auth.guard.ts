import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserPermission } from 'src/shared/core/enums/user-permission.enum';
import { UserRole } from 'src/shared/core/enums/user-role.enum';
import {
  PERMISSIONS_KEY,
  ROLES_KEY,
} from 'src/shared/modules/auth/auth-meta-data';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermission = this.reflector.getAllAndOverride<
      UserPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role || !user.role.permissions) {
      throw new ForbiddenException('Guard Forbidden');
    }

    if (user.role.name === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Check roles
    if (requiredRoles.length && !requiredRoles.includes(user.role.name)) {
      throw new ForbiddenException('Forbidden: role not allowed');
    }

    // Check permissions
    if (requiredPermission.length) {
      const userPermissions = user.role.permissions;
      const hasAllPermissions = requiredPermission.every((p) =>
        userPermissions.includes(p),
      );

      if (!hasAllPermissions) {
        throw new ForbiddenException('Forbidden: missing permissions');
      }
    }

    return true;
  }
}
