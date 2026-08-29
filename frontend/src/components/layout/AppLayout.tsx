import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <div className="erp-shell flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-5 md:p-8 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.6),rgba(2,6,23,0.9))]">
          <div className="mx-auto w-full max-w-7xl animate-[fadeUp_0.45s_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
