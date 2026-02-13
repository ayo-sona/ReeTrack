export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  createdAt: string;
  avatar?: string;
  onboarding_completed?: boolean;
}
