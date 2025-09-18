import { AuthService } from "@/services/auth/authservice";
import { LoginDto } from "@/types/auth/auth";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";


export const useLoginMutation = ({onSuccess, onError}: {onSuccess: (data: any) => void, onError: (error: any) => void}) => {
    const queryClient = useQueryClient();   
    return useMutation({
        mutationFn: (loginDto: LoginDto) => AuthService.login(loginDto),
        onSuccess:  async (data) => {
            const session = await getSession();
            queryClient.setQueryData(['user'], session?.user);
             onSuccess(data);
        },
        onError: (error) => {
            onError(error);
        },
    });
};


export const useSignupMutation = ({onSuccess, onError}: {onSuccess: (data: any) => void, onError: (error: any) => void}) => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (signupDto: signupDto) => AuthService.signup(signupDto),
//     });
 };

