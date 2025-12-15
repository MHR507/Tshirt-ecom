import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Designer', href: '/shop?category=designer' },
    { name: 'Virtual Try-On', href: '/virtual-try-on' },
    { name: 'About', href: '/about' },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    navigate(`/auth?mode=${mode}`);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl tracking-wider text-foreground hover:text-primary transition-smooth">
          THREAD<span className="text-primary">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Cart, Auth & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-foreground/5 transition-smooth"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-foreground/5 transition-smooth"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:shadow-lg transition-smooth"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-up">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-smooth"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="w-full px-4 py-3 text-sm font-medium rounded-lg border border-border hover:bg-foreground/5 transition-smooth"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:shadow-lg transition-smooth"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
