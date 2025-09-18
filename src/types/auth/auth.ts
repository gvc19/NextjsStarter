import { CurrentUser } from "./current-user";

export interface LoginDto {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: CurrentUser;
    token: string;
    tokenType: string;
    expiresAt: string;
}


export interface LoginError {
    message: string;
    statusCode: number;
}

export interface signupDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}