'use client';

import { useEffect } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );
}
