import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import { motion } from "framer-motion";
import { FaFootballBall, FaUsers, FaTrophy } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Home"
        description="This is Football Games Dashboard Home page"
      />

      {/* Hero Section */}
      <div className="py-10 md:py-20 bg-gray-200 flex items-center justify-center">
        <div className="w-full md:w-8/12 px-6 md:px-0">
          <div className="grid grid-cols-12 gap-10 items-center">
            <div className="col-span-8 xl:col-span-7">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl uppercase font-[900] text-primary tracking-wide"
              >
                Play. Compete. Win.
              </motion.h1>
              <p className="mt-4 text-lg text-gray-700">
                Step into the ultimate arena of <span className="font-bold">football games</span>.  
                <br/>
                
                Challenge yourself, compete with friends, and climb the leaderboard.
                <br/>

                <span>
                    Step into a world where football meets fun, strategy, and endless competition. Our platform is designed for every type of player — whether you’re here to test your knowledge, challenge friends, or rise to the top of the global leaderboard.
                </span>
              </p>

              <div className="flex items-center gap-6 mt-10">
                <Button>Play Now</Button>
                <Button variant="outline">
                  Explore Games
                </Button>
              </div>
            </div>

            <div className="col-span-4 xl:col-span-5">
              <div className="flex justify-end items-center">
                <img
                  src="./images/home/home-img.png"
                  alt="Home"
                  className="w-40 md:w-2/3 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Games Section */}
      <div className="py-20 bg-white">
        <div className="w-full md:w-8/12 mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            🎮 Featured Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Bingo", icon: <FaFootballBall size={40} /> },
              { title: "Top List", icon: <FaTrophy size={40} /> },
              { title: "Quick Picks", icon: <FaUsers size={40} /> },
            ].map((game, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 border rounded-2xl shadow hover:shadow-lg cursor-pointer flex flex-col items-center bg-gray-50"
              >
                <div className="mb-4 text-primary">{game.icon}</div>
                <h3 className="text-xl font-bold">{game.title}</h3>
                <p className="text-gray-600 mt-2 text-center">
                  Test your skills in {game.title}. Are you ready to take on the challenge?
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      
    </>
  );
}
