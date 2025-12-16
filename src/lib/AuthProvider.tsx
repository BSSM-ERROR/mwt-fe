'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

function AuthSync({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUser({
                id: (session.user as any).id,
                name: session.user.name || null,
                email: session.user.email || null,
                image: session.user.image || null,
            });
        } else if (status === 'unauthenticated') {
            clearUser();
        }
    }, [session, status, setUser, clearUser]);

    return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthSync>{children}</AuthSync>
        </SessionProvider>
    );
}
