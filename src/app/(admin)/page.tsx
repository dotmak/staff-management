'use client';

import { useAuth } from '../context/AuthContext';

export default function Home() {
  return <div className="">Welcome {useAuth().user?.email}</div>;
}
