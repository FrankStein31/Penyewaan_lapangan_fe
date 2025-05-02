'use client';

import { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext';
import { BookingProvider } from "@/contexts/BookingContext";

export function AuthProvider({ children }) {
    return <AuthContextProvider>{children}</AuthContextProvider>;
}

