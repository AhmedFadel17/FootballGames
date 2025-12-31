import { motion } from "framer-motion";

const footballColors = ['#001524', '#1565C0', '#2196F3', '#00D4FF', '#FFC107'];

const waveVariants = {
  initial: { height: "20%" },
  animate: (i: number) => ({
    height: ["20%", "90%", "20%"],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: i * 0.1, 
      ease: "easeInOut",
    },
  }),
};

interface LoaderProps {
  width?: number;
  height?: number;
  count?: number;
}
const Loader = ({ count = 5, width = 200, height = 200 }: LoaderProps) => {
  return (
    <div>
      <div
        style={{ width: width, height: height }}
        className='flex items-center justify-center overflow-hidden p-[2px]'
      >

        <div className="flex items-end justify-center gap-3 w-full h-full bg-gray-50 rounded-full pb-2">

          {Array(count)
            .fill(null)
            .map((_, index) => {
              return (
                <motion.div
                  key={index}
                  custom={index}
                  variants={waveVariants}
                  animate="animate"
                  initial="initial"
                  style={{
                    backgroundColor: footballColors[index % footballColors.length],
                    width: "12%",
                    borderRadius: "20px",
                  }}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Loader;