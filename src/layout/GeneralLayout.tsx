import React, { ReactNode } from 'react';
import Navbar from '../components/navigation/Navbar';

interface Props {
  children: ReactNode;
}

function GeneralLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex">
        <Navbar />
      </div>
      <main className="bg-white w-full flex-1 py-6">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}

export default GeneralLayout;
