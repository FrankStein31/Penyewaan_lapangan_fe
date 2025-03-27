import React, { useState } from 'react';
import Button from './Button';

/**
 * Header component for application navigation and branding
 * @param {Object} props - Component properties
 * @param {string} props.title - Header title text
 * @param {Array} props.navItems - Navigation items array
 * @param {boolean} props.isLoggedIn - User authentication status
 * @param {Function} props.onLogin - Login handler function
 * @param {Function} props.onLogout - Logout handler function
 */
const Header = ({
  title = 'Sport Center',
  navItems = [],
  isLoggedIn = false,
  onLogin = () => { },
  onLogout = () => { },
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto md:px-6">
        {/* Logo/Title */}
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-black tracking-tight text-blue-600 transition-colors hover:text-blue-700">
            {title}
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="items-center hidden space-x-6 md:flex">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              className="
                font-medium text-gray-600 
                relative 
                after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 
                after:transition-all after:duration-300 
                hover:text-blue-600 hover:after:w-full
              "
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Authentication and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Desktop Authentication Button */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Button
                text="Logout"
                type="secondary"
                size="small"
                onClick={onLogout}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-full hover:bg-gray-200"
              />
            ) : (
              <Button
                text="Login"
                type="primary"
                size="small"
                onClick={onLogin}
                className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors md:hidden hover:text-blue-600 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 w-full transition-all duration-300 bg-white shadow-lg top-full md:hidden">
          <div className="container px-4 py-4 mx-auto space-y-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="block px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-blue-50 hover:text-blue-600"
                onClick={toggleMobileMenu}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile Authentication Button */}
            <div className="mt-4">
              {isLoggedIn ? (
                <Button
                  text="Logout"
                  type="secondary"
                  size="full"
                  onClick={() => {
                    onLogout();
                    toggleMobileMenu();
                  }}
                  className="w-full py-3 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                />
              ) : (
                <Button
                  text="Login"
                  type="primary"
                  size="full"
                  onClick={() => {
                    onLogin();
                    toggleMobileMenu();
                  }}
                  className="w-full py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;