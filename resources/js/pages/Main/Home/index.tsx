import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import { motion } from "framer-motion";
import { FaFootballBall, FaUsers, FaTrophy } from "react-icons/fa";
import { Link } from "react-router-dom";

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
                <br />

                Challenge yourself, compete with friends, and climb the leaderboard.
                <br />

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

      <div className="py-10 md:py-20 bg-white flex items-center justify-center">
        <div className="w-full md:w-8/12 px-6 md:px-0">
          <div className="grid grid-cols-12 gap-10 items-center">
            <div className="col-span-8 xl:col-span-7">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl uppercase font-[900] text-primary tracking-wide"
              >
                Bingo
              </motion.h1>
              <ul className="mt-4 text-lg text-gray-700 list-disc">
                <li>
                  Classic football-themed bingo with real-time matching
                </li>
                <li>
                  Earn points by completing rows, columns, or diagonals

                </li>
                <li>
                  Dynamic grid sizes and randomized match conditions

                </li>
                <li>
                  Track remaining chances and progress live during play

                </li>
                <li>
                  Compete against others and climb the leaderboard

                </li>
                <li>
                  Smart validation and instant feedback on each move

                </li>
              </ul>


              <div className="flex items-center gap-6 mt-10">
                <Link to="/games/bingo">

                <Button>Play Bingo</Button>
                </Link>
                <Button variant="outline">
                  Explore All Games
                </Button>
              </div>
            </div>

            <div className="col-span-4 xl:col-span-5">
              <div className="flex justify-end items-center">
                <img
                  src="./images/home/bingo.png"
                  alt="Home"
                  className="w-50 md:w-2/3 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
                Top List
              </motion.h1>
              <ul className="mt-4 text-lg text-gray-700 list-disc">





                <li>
                  Rank players or teams based on real football stats
                </li>
                <li>
                  Test your knowledge by guessing the correct top positions

                </li>
                <li>
                  Limited chances — every wrong guess costs a heart ❤️

                </li>
                <li>
                  Real-time score tracking and instant correctness feedback

                </li>
                <li>
                  Engaging UI with live slot filling animations

                </li>
                <li>
                  Designed for fast-paced, competitive play sessions

                </li>
              </ul>


              <div className="flex items-center gap-6 mt-10">
                <Link to="/games/top-list">
                <Button>Play Top List</Button>

                </Link>
                <Button variant="outline">
                  Explore All Games
                </Button>
              </div>
            </div>

            <div className="col-span-4 xl:col-span-5">
              <div className="flex justify-end items-center">
                <img
                  src="./images/home/top.png"
                  alt="Home"
                  className="w-50 md:w-2/3 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
