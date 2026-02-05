import { motion } from "framer-motion";

interface UserProfilePicProps {
  user?: User | null;
  isMe?: boolean;
  hasName?: boolean;
  size?: number;
}

const pulseVariants = {
  animate: {
    scale: [0.3, 1.1, 0.3], // Shrinks small, grows to fill the box, then back
    opacity: [0.3, 0.8, 0.3], // Soft fade effect
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const UserProfilePic = ({
  user = null,
  isMe = false,
  size = 20,
  hasName = true
}: UserProfilePicProps) => {
  let borderStyle;
  if (user) {
    if (isMe) {
      borderStyle = "border-green-300";

    } else {
      borderStyle = "border-blue-300";

    }
  } else {
    borderStyle = "border-dashed border-gray-300";
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        style={{ width: size * 4, height: size * 4 }}
        className={`rounded-full border-2 ${borderStyle} flex items-center justify-center overflow-hidden p-[2px] relative bg-gray-50`}
      >
        {user ? (
          <img
            className="h-full w-full rounded-full border border-white object-cover"
            src={user.avatar}
            alt={user.username}
          />
        ) : (
          /* The Pulsing Circle with Gradient */
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="w-full h-full rounded-full"
            style={{
              background: "radial-gradient(circle, #e5e7eb 0%, #9ca3af 100%)",
              boxShadow: "0 0 20px rgba(156, 163, 175, 0.2)",
            }}
          />
        )}
      </div>
      {hasName &&
        <p className="font-bold capitalize text-sm bg-gray-50 px-2 w-full rounded">{user ? user.username : "...."}</p>
      }
    </div>
  );
};

export default UserProfilePic;