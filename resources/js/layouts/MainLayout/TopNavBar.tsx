import { useState } from 'react'
import { NavbarRoutes } from '@/routes/navbar'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Buttons/Button'
import { useAuth } from 'react-oidc-context'
import { showToast } from "@/utils/toast"
export default function TopNavBar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleDashboard = () => {
    const role = auth.user?.profile?.role as string | undefined;
    role === "admin" ? navigate("/dashboard/admin", { replace: true }) : navigate("/dashboard", { replace: true });
  }
  const handleLogin = async () => {
    try {
      await auth.signinRedirect();
    } catch (error) {
      console.error("Redirect execution error:", error);
      showToast.error("Login redirect failed", "Check browser console for details.");
    }
  };

  const handleRegister = async () => {
    try {
      await auth.signinRedirect({ extraQueryParams: { prompt: 'register' } })
    } catch (error: any) {
      showToast.error("Register redirect failed", "Something went wrong while registering. Please try again.")
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signoutRedirect()
    } catch (error: any) {
      showToast.error("Logout failed", "Something went wrong while logging out. Please try again.")
    }
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-dim/80 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto font-headline">

        {/* Logo Section */}
        <div className="text-2xl font-headline font-bold text-white tracking-tight flex items-center">
          <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
            <img src="/images/logo/logo.png" alt="logo" className='w-10 h-10' />
            <div>
              <span className='text-primary-light'>VidiMetrics</span>
              <span className="text-primary">.Ai</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (Visible only on lg screens and up) */}
        <div className="hidden lg:flex items-center gap-10">
          {NavbarRoutes.map((route, index) => (
            <NavLink
              key={index}
              className={({ isActive }: { isActive: boolean }) =>
                `text-base capitalize tracking-widest font-medium transition-colors ${isActive
                  ? 'text-primary'
                  : 'text-white/60 hover:text-white'
                }`
              }
              to={route.path}
              end={route.path === '/'}
            >
              {route.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth Buttons (Visible only on lg screens and up) */}
        <div className="hidden lg:flex items-center gap-6">
          {auth.isAuthenticated ? (
            <>
              <Button variant="primary" onClick={handleDashboard}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleLogin}>
                Login
              </Button>
              <Button variant="light" wrapperClassName="overflow-hidden" onClick={handleRegister}>
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile & Medium Screen Toggle Button */}
        <div className="flex lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <span className='material-symbols-outlined text-2xl'>close</span> : <span className='material-symbols-outlined text-2xl'>menu</span>}
          </button>
        </div>
      </div>

      {/* Mobile & Medium Overlay Menu */}
      {isOpen && (
        <div className="lg:hidden bg-surface-dim border-b border-white/5 px-8 py-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-5 duration-200">
          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            {NavbarRoutes.map((route, index) => (
              <NavLink
                key={index}
                onClick={() => setIsOpen(false)} // Close menu on click
                className={({ isActive }: { isActive: boolean }) =>
                  `text-sm uppercase tracking-widest font-bold transition-colors py-2 ${isActive
                    ? 'text-primary'
                    : 'text-white/60 hover:text-white'
                  }`
                }
                to={route.path}
                end={route.path === '/'}
              >
                {route.label}
              </NavLink>
            ))}
          </div>

          <hr className="border-white/5" />

          {/* Action/Auth Buttons */}
          <div className="flex flex-col gap-3">
            {auth.isAuthenticated ? (
              <>
                <Button variant="primary" className="w-full" onClick={() => { handleDashboard(); setIsOpen(false); }}>
                  Dashboard
                </Button>
                <Button variant="outline" className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full" onClick={() => { handleLogin(); setIsOpen(false); }}>
                  Login
                </Button>
                <Button variant="light" className="w-full" wrapperClassName="overflow-hidden" onClick={() => { handleRegister(); setIsOpen(false); }}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}