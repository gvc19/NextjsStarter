import { CurrentUser } from "@/types";
import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string
        expires?: string;
        user?: CurrentUser
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        user?: CurrentUser
        expires?: string
    }
}

// Custom error class for authentication errors
class AuthError extends Error {
    constructor(message: string, public statusCode: number = 400) {
        super(message);
        this.name = 'AuthError';
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any, req: any) {
                if (!credentials?.username || !credentials?.password) {
                    throw new AuthError('Username and password are required');
                }
                if (!BASE_URL) {
                    throw new AuthError('API URL configuration is missing', 500);
                }
             
                const res = await fetch(`${BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"  // Add this header
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                });
                const data = await res.json();
                console.log("authorize - user", data)
                if (res.ok && data) {
                    return data
                }
                // Handle different HTTP status codes
                if (!res.ok) {
                    switch (res.status) {
                        case 401:
                            throw new AuthError('Invalid credentials');
                        case 404:
                            throw new AuthError('User not found');
                        case 429:
                            throw new AuthError('Too many login attempts. Please try again later');
                        case 503:
                            throw new AuthError('Authentication service is temporarily unavailable', 503);
                        default:
                            throw new AuthError(`Authentication failed: ${data.message || 'Unknown error'}`, res.status);
                    }
                }
                if (!data || !data.token) {
                    throw new AuthError('Invalid response from authentication server');
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
        error: '/error',
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.accessToken = user.token
                token.user = user.user || user
                token.expires = user.expiresAt || user.tokenExpiration;
                token.name = user.user?.username || user.username
            }
            return token
        },
        async session({ session, token }: any) {
            session.accessToken = token.accessToken
            session.user = token.user
            session.expires = token.expires
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET,
        maxAge: 365 * 24 * 60 * 60
    }
});

export { handler as GET, handler as POST }