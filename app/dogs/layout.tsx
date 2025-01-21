'use client';

import { useEffect } from "react";
import Auth from "../services/auth";
import { useRouter } from 'next/navigation';
import Header from "../components/Header";

export default function DogsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Check if the user is not logged in and redirect if true
  useEffect(() => {
    const user = Auth.getUser();
    if (!user) {
      router.push('/');
    }
  }, [router]);

  return (
    <div>
      <Header></Header>    
      <main>{children}</main>
    </div>
  );
}
  