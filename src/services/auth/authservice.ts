import ApiBase from "@/config/apiBase";
import { LoginDto, LoginResponse } from "@/types/auth/auth";
import { signIn } from "next-auth/react";


export class AuthService extends ApiBase {

    public static async login(data: LoginDto): Promise<LoginResponse> {
        console.log('Attempting login with:', { username: data.username });
        try {
            const response = await signIn("credentials", {
                username: data.username,
                password: data.password,
                redirect: false,
            });
            console.log('Login response:', response);
            if (response?.error) {
                console.error('Login error:', response.error);
                throw new Error(response.error);
            }
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    public static async signup(data: signupDto): Promise<SignupResponse> {
        console.log('Attempting signup with:', { email: data.email });
        try {
            const response = await signUp("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
        }
    }
}