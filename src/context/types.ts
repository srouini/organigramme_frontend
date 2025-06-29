export type DataResult = any; // Replace `any` with a more specific type if available

export interface UseDataResult {
  refetch: () => Promise<any>;
  data: DataResult | null;
  isLoading: boolean;
  isRefetching: boolean;
}

export interface ReferenceContextProps {
  navire: UseDataResult;
  cosignataire: UseDataResult;
  armateur: UseDataResult;
  port: UseDataResult;
  gros: UseDataResult;
  client: UseDataResult;
  banque: UseDataResult;
  transitaire: UseDataResult;
  bareme: UseDataResult;
  regime: UseDataResult;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  user_permissions: string[];
  groups: string[];
  profile: {
    layout_preference: string;
    theme_color: string;
    theme_mode: string;
    allowed_pages: string[];
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface BreadcrumbType {
   items: ({ path: null; title: JSX.Element; } | { path: string; title: string; })[]
}