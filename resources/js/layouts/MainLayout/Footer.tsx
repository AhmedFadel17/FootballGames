import { Link } from "react-router-dom";

export default function Footer() {
  const appName = import.meta.env.VITE_APP_NAME;

  return (
    <footer className="bg-surface-container-lowest border-t border-white/10 pt-16 pb-24 md:pb-12 relative overflow-hidden md:pl-20">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/20 blur-[100px] pointer-events-none"></div>
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center relative z-10">
        <h2 className="font-display-lg text-display-lg md:text-[56px] font-black italic uppercase text-white tracking-tighter mb-6">
          Ready to take the field?
        </h2>
        <p className="font-title-md text-title-md text-on-surface-variant mb-8 max-w-lg mx-auto">
          Join thousands of players already building their legacy in the Football Arena.
        </p>
        <Link
          to="/games/bingo-football"
          className="red-action px-10 py-5 rounded font-headline-lg-mobile text-[20px] font-bold uppercase tracking-wider inline-flex items-center gap-3"
        >
          Get Started Now <span className="material-symbols-outlined">sports_score</span>
        </Link>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant/60 font-label-sm text-label-sm">
          <div className="flex items-center gap-2">
            <img src="/images/logo/fotfun.png" alt="Logo" className="rounded-xl w-10 h-10 object-contain" />
            <span className="font-bold italic text-white/70 tracking-wider">{appName}</span>
          </div>
          <div>© {new Date().getFullYear()} {appName}. All rights reserved.</div>
          <div className="flex gap-6">
            <Link className="hover:text-primary transition-colors" to="/terms">Terms</Link>
            <Link className="hover:text-primary transition-colors" to="/privacy">Privacy</Link>
            <Link className="hover:text-primary transition-colors" to="/contact">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

