import PageMeta from "@/components/common/PageMeta";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const games = [
    {
      id: "bingo",
      title: "Football Bingo",
      category: "Tactical Grid",
      description: "A strategic puzzle connecting leagues and nations. Test your deep tactical knowledge.",
      icon: "grid_on",
      iconColor: "text-primary",
      path: "/games/bingo-football",
      badge: "Popular",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCr6Vr9AHfBUDkg-_PcuaCXWvspTyQ2OJKcHEDVipRT9OM7ZGNc1STLTo2aj8W5AdrvMmTUou6716YTMbsiNLbj_tRzAvJoX1u4LqW7thRIP_zdkm4_MjeKh3L3bBAbsv3RarkrIroFDM_iDUzzXemiVONOBMSr4UAQBW8vjChEaT8lpmT1r08cUfOPIoYABUeifR6t9AUu684hkcmJ17FcCdVARccD7v_JSHqkCzJVgnvahwqHmT7y"
    },
    {
      id: "guess",
      title: "Guess the Player",
      category: "Trivia & Mystery",
      description: "Identify the mystery star from their career path, transfer history, and stats.",
      icon: "person_search",
      iconColor: "text-secondary",
      path: "/games/guess-the-player",
      badge: "Daily Challenge",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKi81XaW7y16oFZ75_kkECuHljs8yg_lsmQTBZ2BBK0mSaZal4HhD7xVHQJUYJD__0-NCc2IojC4uj6s_VMhPCMb3TmA1sbKjBr_kpx6WNVj0o0FLLSJi_UVM_-SbsET3HN_iyq0h1JqbkA30FSDTCmP_KAjhL6bFCRVU4INwqFyZT8cyiwWcGNK2Xn8nPZa7-P5n0Q2JPMssJ7svqCtkyMinwkF4AYzBy9jm_DTvIHG7dV6X_OQK6"
    },
    {
      id: "grid",
      title: "Football Grid",
      category: "Matrix Challenge",
      description: "Build your grid, match teams and countries, and showcase your football IQ.",
      icon: "shield",
      iconColor: "text-primary",
      path: "/games/football-grid",
      badge: "Esports Ready",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAL9xti46ZFWmXxsIzEjj9PgycN_QgmlSqzpt6BHW7UC0n1gL1eAoJ2Ck-ypMKn69BwWHKASKxTmZeFcZUU6Q_WydVQj5gi-oO0jv_Dy8kF0ci_zXNy_t8dEX8WaOBc-hEHRM3ijbmhYf3ZNfnf3wIGtcx3jQLj4XAaP8s2IOj22v835ptEQeeBLxDPUUoPtpQfUjIkhHFiRd6-4s9845wtPj6O_qsmIuWI_bm7T7GL2AqGvXz7Odni"
    },
    {
      id: "toplist",
      title: "Top List",
      category: "Stats & Ranking",
      description: "Rank players and teams based on real stats. Every wrong guess costs a heart!",
      icon: "leaderboard",
      iconColor: "text-yellow-400",
      path: "/games/top-list",
      badge: "High Stakes",
      bgImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCr6Vr9AHfBUDkg-_PcuaCXWvspTyQ2OJKcHEDVipRT9OM7ZGNc1STLTo2aj8W5AdrvMmTUou6716YTMbsiNLbj_tRzAvJoX1u4LqW7thRIP_zdkm4_MjeKh3L3bBAbsv3RarkrIroFDM_iDUzzXemiVONOBMSr4UAQBW8vjChEaT8lpmT1r08cUfOPIoYABUeifR6t9AUu684hkcmJ17FcCdVARccD7v_JSHqkCzJVgnvahwqHmT7y"
    },
  ];

  const scrollToLeaderboard = () => {
    const leaderboardEl = document.getElementById("leaderboards-section");
    if (leaderboardEl) {
      leaderboardEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <PageMeta
        title="Football Arena - The Ultimate Experience"
        description="Compete. Win. Dominate. The world's #1 football gaming & trivia platform designed for the tactical elite."
      />



      <div className="w-full pt-20">
        {/* 1. Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden w-full">
          {/* Background Image & Grid Overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="bg-cover bg-center w-full h-full opacity-40 mix-blend-luminosity scale-105 transform animate-pulse duration-[10000ms]"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCg0Uf0MSowhV3hNv9LCnzgEnyuzslX9QHfkQJoy8SH0Ut-LxSvY2hHiV4Qt6zjTk7LO3Lq23lkxeYyI5bAKnT5LKNLY_wn63twFKJyPSuyKsUmE564hXXb4lTPyBOkSA3iN2znkgxmiuYVlJ-ngLhtypB6LjWYRUz9-MF8Wf6p_93Tw1wGPi1ty0I5IvuULn2-9mraMzUP-87RsNHb11MsfxMesSgTkQWrrA3RelvXkRIgbhHke6ya')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 hero-grid pointer-events-none" />
          </div>

          <div className="relative z-10 text-center px-gutter max-w-4xl mx-auto flex flex-col items-center gap-6 my-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-widest backdrop-blur-sm mb-2"
            >
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              Season 4 Now Live
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display-lg text-display-lg md:text-[72px] md:leading-[80px] font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_20px_rgba(173,198,255,0.3)]"
            >
              The Ultimate <br />
              <span className="text-primary drop-shadow-[0_0_30px_rgba(77,142,255,0.5)]">
                Football Arena
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-title-md text-title-md text-on-surface-variant max-w-2xl mx-auto mt-2"
            >
              Compete. Win. Dominate. The world's #1 football gaming & trivia platform designed for the tactical elite.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 flex flex-col sm:flex-row gap-4 items-center"
            >
              <button
                onClick={() => navigate("/games/bingo-football")}
                className="red-action px-8 py-4 rounded font-title-md text-title-md font-bold uppercase tracking-wider flex items-center gap-2"
              >
                Play Now <span className="material-symbols-outlined">play_arrow</span>
              </button>
              <button
                onClick={scrollToLeaderboard}
                className="glass-panel glow-border px-8 py-4 rounded font-title-md text-title-md font-bold uppercase tracking-wider flex items-center gap-2 text-primary"
              >
                View Rankings <span className="material-symbols-outlined">trending_up</span>
              </button>
            </motion.div>
          </div>
        </section>

        {/* 2. Game Universe */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg md:text-[48px] font-black italic uppercase text-white tracking-tighter">
              Enter The Arena
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 shadow-[0_0_10px_rgba(77,142,255,0.8)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(game.path)}
                className="glass-panel rounded-xl overflow-hidden group cursor-pointer border border-surface-variant hover:border-primary transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 relative overflow-hidden">
                    <div
                      className="bg-cover bg-center w-full h-full group-hover:scale-110 transition-transform duration-500 opacity-60"
                      style={{ backgroundImage: `url('${game.bgImage}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-[#1e293b]/40 to-transparent" />

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-surface/80 backdrop-blur-md border border-white/10 font-label-sm text-xs text-primary font-bold uppercase">
                      {game.badge}
                    </div>

                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className={`material-symbols-outlined text-3xl ${game.iconColor}`}>
                        {game.icon}
                      </span>
                      <span className="text-xs font-bold uppercase text-white/70 tracking-wider">
                        {game.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-headline-lg text-[24px] font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <button className="text-primary font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1 group-hover:text-primary-container transition-colors">
                    Start Game <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Prize Showcase */}
        <section className="py-24 bg-surface-container-low relative border-y border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,90,194,0.08)_0,transparent_60%)] pointer-events-none" />
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2 className="font-headline-lg text-headline-lg md:text-[40px] font-black italic uppercase text-white tracking-tighter">
                  Win Legendary Rewards
                </h2>
                <p className="font-title-md text-title-md text-on-surface-variant mt-2">
                  Convert your football knowledge into exclusive trophies and digital assets.
                </p>
              </div>
              <button className="glass-panel px-6 py-3 rounded text-primary font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-2 hover:bg-white/10 transition-colors">
                View Reward Store <span className="material-symbols-outlined">shopping_cart</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Reward 1 */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-surface p-6 rounded-lg glow-border flex flex-col items-center text-center relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <span
                  className="material-symbols-outlined text-5xl text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  monetization_on
                </span>
                <h4 className="font-title-md text-title-md font-bold text-white">Arena Coins</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Daily Match Payouts</p>
              </motion.div>

              {/* Reward 2 */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-surface p-6 rounded-lg glow-border flex flex-col items-center text-center relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <span
                  className="material-symbols-outlined text-5xl text-purple-400 mb-4 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  diamond
                </span>
                <h4 className="font-title-md text-title-md font-bold text-white">Elite Gems</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Tournament Trophies</p>
              </motion.div>

              {/* Reward 3 */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-surface p-6 rounded-lg glow-border flex flex-col items-center text-center relative overflow-hidden group sm:col-span-2 md:col-span-2 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                <div className="flex items-center gap-6 z-10 w-full">
                  <div className="w-24 h-28 bg-surface-variant rounded border border-primary/50 shadow-[0_0_20px_rgba(77,142,255,0.4)] flex items-center justify-center transform rotate-[-5deg] group-hover:rotate-0 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-primary">military_tech</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-title-md text-[24px] font-bold text-white uppercase italic">Icon Packs</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xs">
                      Unlock legendary historical players for your custom squads.
                    </p>
                    <div className="mt-3 inline-block px-2.5 py-1 bg-secondary-container/30 border border-secondary/40 rounded text-secondary font-label-sm text-label-sm uppercase">
                      Ultra Rare Drop
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. Competitive Features Bento */}
        <section id="leaderboards-section" className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Live Leaderboards */}
            <div className="md:col-span-2 glass-panel rounded-xl p-8 relative overflow-hidden border border-outline-variant hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">public</span>
                </div>
                <h3 className="font-headline-lg text-[32px] font-black italic text-white uppercase tracking-tight mb-2">
                  Live Global Leaderboards
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">
                  Track your standing against the world's best tacticians in real-time. Seasonal resets mean fresh opportunities for glory.
                </p>

                {/* Leaderboard mockup */}
                <div className="bg-surface/60 border border-white/10 rounded-lg p-4 max-w-md shadow-xl">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2.5 mb-2">
                    <span className="text-white font-bold text-sm flex items-center gap-2">
                      <span className="text-yellow-400 text-xs">🥇 1</span> Striker_07
                    </span>
                    <span className="text-primary font-bold text-sm">14,250 PTS</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2.5 mb-2 bg-primary/10 border-l-4 border-l-primary p-2 rounded">
                    <span className="text-white font-bold text-sm flex items-center gap-2">
                      <span className="text-secondary font-bold text-xs">▲ 2</span> 2. You (Lvl 24)
                    </span>
                    <span className="text-primary font-bold text-sm">13,900 PTS</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 opacity-70">
                    <span className="text-white font-bold text-sm flex items-center gap-2">
                      <span className="text-gray-400 text-xs">🥉 3</span> Madridista99
                    </span>
                    <span className="text-primary font-bold text-sm">13,100 PTS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Daily Challenges */}
            <div className="glass-panel rounded-xl p-8 border border-outline-variant hover:border-primary/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-secondary-container/40 rounded flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl">local_fire_department</span>
                </div>
                <h3 className="font-title-md text-[24px] font-black italic text-white uppercase tracking-tight mb-2">
                  Daily Challenges
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Log in daily for time-sensitive, high-stakes challenges. Complete them before the whistle blows for multiplier bonuses.
                </p>
              </div>

              <div className="mt-8 p-4 rounded bg-surface/50 border border-white/5 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-bold uppercase">Reset in</span>
                <span className="text-secondary font-mono font-bold text-sm">04h 12m 39s</span>
              </div>
            </div>

            {/* Feature 3: Pro Esports */}
            <div className="md:col-span-3 glass-panel rounded-xl p-8 border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-surface-container to-surface">
              <div className="max-w-xl">
                <h3 className="font-headline-lg text-[28px] font-black italic text-white uppercase tracking-tight mb-2">
                  Pro-Grade Esports Aesthetic
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Built for intense gaming sessions. Deep obsidian themes, high-contrast data visualization, and instant WebSocket performance ensure total focus.
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-secondary border-b-transparent animate-spin-reverse" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile pb-3 h-16 bg-surface-dim/90 backdrop-blur-md border-t border-white/10 shadow-[0_-4px_12px_rgba(0,0,0,0.5)]">
        <Link to="/" className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(77,142,255,0.6)]">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-caps text-[10px] uppercase font-bold mt-0.5">Home</span>
        </Link>
        <Link to="/games/bingo-football" className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">grid_on</span>
          <span className="font-label-caps text-[10px] uppercase font-bold mt-0.5">Bingo</span>
        </Link>
        <Link to="/games/guess-the-player" className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">person_search</span>
          <span className="font-label-caps text-[10px] uppercase font-bold mt-0.5">Guess</span>
        </Link>
        <Link to="/games/football-grid" className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">shield</span>
          <span className="font-label-caps text-[10px] uppercase font-bold mt-0.5">Grid</span>
        </Link>
        <Link to="/games/top-list" className="flex flex-col items-center justify-center text-on-surface-variant/60 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="font-label-caps text-[10px] uppercase font-bold mt-0.5">Top List</span>
        </Link>
      </nav>
    </>
  );
}

