import { useState } from 'react'
import { NavbarRoutes } from '@/routes/navbar'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import Button from '@/components/ui/Buttons/Button'
import { useAuth } from 'react-oidc-context'
import { showToast } from "@/utils/toast"

export default function TopNavBar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileGamesOpen, setIsMobileGamesOpen] = useState(false);

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
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-8 h-20 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(77,142,255,0.1)] z-50">
      {/* Logo Section */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <span className="material-symbols-outlined text-primary text-3xl">sports_soccer</span>
        <span className="font-headline font-black italic tracking-tighter text-xl md:text-2xl text-primary">FOOTBALL ARENA</span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex gap-8 items-center">
        {NavbarRoutes.map((route: any, index: number) => {
          const isParentActive = route.isDropdown
            ? location.pathname.startsWith(route.path)
            : false;

          if (route.isDropdown && route.children) {
            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <NavLink
                  to={route.path}
                  className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors duration-200 py-2 ${isParentActive
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                  <span>{route.label}</span>
                  <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </NavLink>

                {/* Desktop Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-56 pt-2 z-50">
                    <div className="bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 flex flex-col gap-1">
                      {route.children.map((child: any, childIndex: number) => (
                        <NavLink
                          key={childIndex}
                          to={child.path}
                          end={child.path === route.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={({ isActive }: { isActive: boolean }) =>
                            `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                            }`
                          }
                        >
                          <span>{child.label}</span>
                          {child.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-primary/20 text-primary border border-primary/30">
                              {child.badge}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={index}
              className={({ isActive }: { isActive: boolean }) =>
                `text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${isActive
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
                }`
              }
              to={route.path}
              end={route.path === '/'}
            >
              {route.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Desktop Right Side */}
      <div className="hidden lg:flex items-center gap-4">
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
            <button
              onClick={handleLogin}
              className="glass-panel glow-border px-5 py-2 rounded text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-all"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="red-action px-5 py-2 rounded text-sm font-bold uppercase tracking-wider flex items-center gap-1"
            >
              Get Started <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <div className="flex lg:hidden items-center gap-3">
        <button
          onClick={toggleMenu}
          className="text-white hover:text-primary transition-colors focus:outline-none p-1"
          aria-label="Toggle Menu"
        >
          {isOpen ? <span className='material-symbols-outlined text-3xl'>close</span> : <span className='material-symbols-outlined text-3xl'>menu</span>}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-surface-dim/95 border-b border-white/10 px-6 py-6 flex flex-col gap-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-5 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {NavbarRoutes.map((route: any, index: number) => {
              if (route.isDropdown && route.children) {
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <button
                      onClick={() => setIsMobileGamesOpen(!isMobileGamesOpen)}
                      className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary py-2 text-left"
                    >
                      <span>{route.label}</span>
                      <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isMobileGamesOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>

                    {isMobileGamesOpen && (
                      <div className="pl-4 flex flex-col gap-2 border-l border-white/10">
                        {route.children.map((child: any, childIndex: number) => (
                          <NavLink
                            key={childIndex}
                            to={child.path}
                            end={child.path === route.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }: { isActive: boolean }) =>
                              `text-xs font-bold uppercase tracking-wider py-1.5 flex items-center justify-between ${isActive ? 'text-primary' : 'text-on-surface-variant/80 hover:text-primary'
                              }`
                            }
                          >
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-primary/20 text-primary">
                                {child.badge}
                              </span>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }: { isActive: boolean }) =>
                    `text-sm font-bold uppercase tracking-wider transition-colors py-2 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                    }`
                  }
                  to={route.path}
                  end={route.path === '/'}
                >
                  {route.label}
                </NavLink>
              );
            })}
          </div>

          <hr className="border-white/10" />

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
                <button
                  onClick={() => { handleLogin(); setIsOpen(false); }}
                  className="w-full glass-panel glow-border py-3 rounded text-sm font-bold uppercase text-primary text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => { handleRegister(); setIsOpen(false); }}
                  className="w-full red-action py-3 rounded text-sm font-bold uppercase text-center flex items-center justify-center gap-2"
                >
                  Get Started <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}