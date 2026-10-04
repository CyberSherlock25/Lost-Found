import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((previous) => !previous);
  };

  /*
   * Close the mobile sidebar when the viewport becomes desktop-sized.
   * This prevents the drawer state from carrying over after resizing.
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /*
   * Allow Escape to close the mobile navigation.
   */
  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileSidebarOpen]);

  /*
   * Prevent the page behind the mobile drawer from scrolling.
   */
  useEffect(() => {
    if (!isMobileSidebarOpen) {
      document.body.style.overflow = '';
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="erp-shell flex min-h-screen w-full min-w-0">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={toggleMobileSidebar} />

        <main
          className="
            min-w-0
            flex-1
            overflow-x-hidden
            bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.6),rgba(2,6,23,0.9))]
            px-3
            py-4
            sm:px-4
            sm:py-5
            md:px-6
            md:py-6
            lg:px-8
            lg:py-8
          "
        >
          <div
            className="
              mx-auto
              w-full
              min-w-0
              max-w-7xl
              animate-[fadeUp_0.45s_ease-out]
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};