import apiClient from "@/lib/apiClient";

// ============================================
// Types & Interfaces
// ============================================

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
      status: string;
      avatarUrl: string | null;
    };
    organizations: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
      slug: string;
      logoUrl: string | null;
    }[];
  };
}

// Register
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

// Verify Email (OTP)
export interface SendVerificationRequest {
  email: string;
}

export interface SendVerificationResponse {
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  message: string;
}

// Forgot Password
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Reset Password
export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Logout
export interface LogoutResponse {
  message: string;
}

export interface OrgUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  avatarUrl: string | null;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  slug: string;
  logoUrl: string | null;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    user: OrgUser;
    organizations: Organization[];
  };
}

// ============================================
// API Functions
// ============================================

export const authApi = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post("/auth/register-user", data);
    return response.data;
  },

  /**
   * Send verification code to user's email
   */
  sendVerificationCode: async (
    data: SendVerificationRequest,
  ): Promise<SendVerificationResponse> => {
    const response = await apiClient.post("/auth/send-verification", data);
    return response.data;
  },

  /**
   * Verify email with OTP code
   */
  verifyEmail: async (
    data: VerifyEmailRequest,
  ): Promise<VerifyEmailResponse> => {
    const response = await apiClient.post("/auth/verify-email", data);
    return response.data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (
    data: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};
