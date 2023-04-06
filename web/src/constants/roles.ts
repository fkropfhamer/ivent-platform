declare enum UserRole {
  User = 'ROLE_USER',
  Admin = 'ROLE_ADMIN',
  Service = 'ROLE_SERVICE',
}

export const userRoleToDisplayString = (role: UserRole): string => {
  switch (role) {
    case UserRole.User: return 'User'
    case UserRole.Admin: return 'Admin'
    case UserRole.Service: return 'Service'
  }
}

export default UserRole
