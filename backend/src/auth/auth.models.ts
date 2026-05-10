export interface AuthRequest {
  user: {
    userId: number;
    sub: number;
    email: string;
    role: string;
    refreshToken: string;
  };
}

export interface SignupDto {
  email: string;
  password: string;
}
