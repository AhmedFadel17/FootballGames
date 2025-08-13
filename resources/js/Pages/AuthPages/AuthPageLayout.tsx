import React from "react";
import GridShape from "@/components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col justify-center items-center max-w-sm">
              <Link to="/" className="block mb-4">
                <img
                  width={80}
                  height={48}
                  src="/images/logo/logo.png"
                  alt="Logo"
                  className="bg-primary rounded"
                />
              </Link>
              <h4 className="text-xl text-left font-bold mb-4">Join the Ultimate Football Challenge!</h4>
              <p className="text-center text-gray-400 dark:text-white/60">
                Build your dream team, play exciting mini-games like Bingo & Top 10, climb the leaderboards, and prove you’re the real football mastermind.
                <br/>
                <br/>
                Free to join. Easy to play. Fun to win.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
