'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
      <Link href="/" className="logo font-bold">
        Business Management
      </Link>
      <nav className="flex gap-6 items-center">
        <Link
          href="/businesses"
          className="text-blue-600 font-medium hover:underline"
        >
          Businesses
        </Link>
        <Link
          href="/staff"
          className="text-blue-600 font-medium hover:underline"
        >
          Staff Members
        </Link>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
