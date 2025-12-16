import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import { supabaseServer } from "@/lib/supabase-server";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'profile_nickname profile_image',
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                let userId: string;
                let email: string;

                if (user.email) {
                    userId = user.email.split('@')[0];
                    email = user.email;
                } else {
                    userId = `${account?.provider}_${user.id}`;
                    email = `${userId}@${account?.provider}.local`;
                }

                const { data: existingUser } = await supabaseServer
                    .from('user')
                    .select('*')
                    .eq('email', email)
                    .single();

                if (!existingUser) {
                    const { error } = await supabaseServer
                        .from('user')
                        .insert({
                            id: userId,
                            name: user.name || userId,
                            email: email,
                            profile_image: user.image || '',
                        } as any);

                    if (error) {
                        return false;
                    }
                }

                return true;
            } catch (error) {
                return false;
            }
        },
        async jwt({ token, user, account, trigger }) {
            if ((trigger === 'signIn' || trigger === 'signUp') && user && account) {
                const email = user.email || `${account.provider}_${user.id}@${account.provider}.local`;
                const { data: userData } = await supabaseServer
                    .from('user')
                    .select('id, name, email, profile_image')
                    .eq('email', email)
                    .single();

                if (userData) {
                    token.id = (userData as any).id;
                    token.name = (userData as any).name;
                    token.email = (userData as any).email;
                    token.picture = (userData as any).profile_image;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };