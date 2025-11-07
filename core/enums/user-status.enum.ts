// src/shared/enums/user-status.enum.ts
export enum UserStatus {
  ACTIVE = 'active', // Tài khoản đang hoạt động
  INACTIVE = 'inactive', // Tài khoản bị khóa / chưa kích hoạt
  PENDING = 'pending', // Đang chờ duyệt
  BANNED = 'banned', // Bị cấm
}
