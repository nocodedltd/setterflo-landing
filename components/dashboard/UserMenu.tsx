'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings } from 'lucide-react';
import { signOut } from '@/lib/auth/supabase-auth';

interface UserMenuProps {
  userEmail?: string;
  userName?: string;
}

export function UserMenu({ userEmail, userName }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {userName ? userName.charAt(0).toUpperCase() : <User size={16} />}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
          <p className="text-xs text-gray-500">{userEmail}</p>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white border border-gray-200 py-1 z-20">
            <button
              onClick={() => {
                router.push('/dashboard/settings');
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <hr className="my-1" />
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
