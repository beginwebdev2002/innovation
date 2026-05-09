import { email, maxLength, minLength, required, schema } from "@angular/forms/signals";

export type Role = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  password: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SignUpModel = Omit<User, 'id' | 'role' | 'accessToken' | 'refreshToken' | 'createdAt' | 'updatedAt'>;

export type SignInModel = Omit<User, 'id' | 'role' | 'accessToken' | 'refreshToken' | 'createdAt' | 'updatedAt'>;

export const initialSignUpModel: SignUpModel = {
    email: '',
    password: ''
};

export const initialSignInModel: SignInModel = {
    email: '',
    password: ''
};

export const signupValidationSchema = schema<SignUpModel>((user) => {
    required(user.email, {message: 'Введите email'});
    maxLength(user.email, 100, {message: 'Email должен быть не длиннее 100 символов'});
    email(user.email, {message: 'Введите корректный email'});

    required(user.password, {message: 'Введите пароль'});
    minLength(user.password, 8, {message: 'Пароль должен быть не короче 8 символов'});
    maxLength(user.password, 20, {message: 'Пароль должен быть не длиннее 20 символов'});
});

export const signinValidationSchema = schema<SignInModel>((user) => {
    required(user.email, {message: 'Введите email'});
    maxLength(user.email, 100, {message: 'Email должен быть не длиннее 100 символов'});
    email(user.email, {message: 'Введите корректный email'});

    required(user.password, {message: 'Введите пароль'});
    minLength(user.password, 8, {message: 'Пароль должен быть не короче 8 символов'});
    maxLength(user.password, 20, {message: 'Пароль должен быть не длиннее 20 символов'});
});
