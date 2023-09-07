import { motion } from 'framer-motion';
import { MenuIcon, X } from 'lucide-react';
import { ReactElement, useState } from 'react';

import Header from '@/components/layout/DashboardLayout/Header';

// import Header from '@/components/layout/Sidebar/Header';
// import Logo from '@/components/UI/icons/Logo';

interface TopBarProps {
  leftContainer?: ReactElement;
  mainContainer?: ReactElement;
  rightContainer?: ReactElement;
}

const variants = {
  open: {
    x: '0%',
  },
  closed: {
    x: '-100%',
  },
};

export function TopBar({ leftContainer, mainContainer, rightContainer }: TopBarProps) {
  const [isMobileLeftSidebarOpen, setIsMobileLeftSidebarOpen] = useState(false);
  return (
    <>
      <header className='z-100 absolute left-0 top-0 hidden h-[70px] w-full flex-shrink-0 divide-x divide-gray-100 bg-white lg:flex'>
        {leftContainer && (
          <div className='flex w-60 flex-shrink-0 items-center px-3'>{leftContainer}</div>
        )}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center px-4'>{mainContainer}</div>
          <div className='flex items-center gap-x-4 px-4'>{rightContainer}</div>
        </div>
      </header>

      <nav className=' lg:hidden'>
        <header className='absolute left-0 top-0 z-50 flex h-14 w-full flex-shrink-0 items-center bg-gray-900 px-4'>
          <div className='h-full w-full'>
            <div className='mx-auto flex h-full'>
              <div className='flex items-center'>
                <div
                  className='flex h-full items-center'
                  onClick={() => setIsMobileLeftSidebarOpen((prev) => !prev)}
                >
                  <span className='sr-only'>Open main menu</span>
                  {isMobileLeftSidebarOpen ? (
                    <X className='text-white' />
                  ) : (
                    <MenuIcon className='text-white' />
                  )}
                </div>
                {leftContainer && (
                  <div className='hidden w-60 flex-shrink-0 items-center px-3'>{leftContainer}</div>
                )}
              </div>
              <div className='flex w-full items-center justify-between gap-x-4'>
                <div className='flex items-center'>{mainContainer}</div>
                <div className='flex items-center'>{rightContainer}</div>
              </div>
            </div>
          </div>
        </header>
        <motion.div
          initial={false}
          animate={isMobileLeftSidebarOpen ? 'open' : 'closed'}
          variants={variants}
          transition={{ ease: 'easeOut', duration: 0.15 }}
          className='absolute bottom-0 left-0 top-14 z-50 m-auto'
        >
          <Header />
        </motion.div>
      </nav>

      <div className='mt-14 w-full lg:mt-[70px] lg:block' />
    </>
  );
}

export default TopBar;
