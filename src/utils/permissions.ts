import { useAuth } from '@/context/AuthContext';

// Type for the permission check function
type PermissionCheckFunction = (requiredPermission: string) => boolean;

// Hook to check permissions
export const usePermissions = (): PermissionCheckFunction => {
  const { user } = useAuth();

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user) return false;
    
    // Superuser has all permissions
    if (user.is_superuser || user.user_permissions.includes('*')) return true;
    
    // Check if user has the specific permission
    return user.user_permissions.includes(requiredPermission);
  };

  return hasPermission;
};
