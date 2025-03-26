import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-main container">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <div className="footer-content">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Vesting Wallet Claim dApp
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
