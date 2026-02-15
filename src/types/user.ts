export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  email_verified: boolean;
  date_of_birth: string | null;
  address: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}
