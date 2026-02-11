import UserProfilePic from "@/pages/Dashboard/Multi/components/UserProfilePic";
import GuessThePlayerSearch from "./GuessThePlayerSearch";
import { FaMicrophone as Mic, FaMicrophoneLinesSlash as MicOff } from "react-icons/fa6";

const unknownPlayerImgSrc = "https://icon-library.com/images/2018/2503231_sharks-player-profile-silhouette-hd-png-download.png";

interface GuessThePlayerCardProps {
  isMe: boolean,
  user: User | null,
  index: number,
  player: Player | null,
  assignmentId: number,
  isSpeaking?: boolean,
  isMuted?: boolean,
  onToggleMic: any
}

export default function GuessThePlayerCard({ assignmentId, index, player, user, isMe = true, isSpeaking = false, isMuted = false, onToggleMic }: GuessThePlayerCardProps) {
  let borderStyle = isMe ? "border-blue-500" : "border-gray-300";
  const alignDir = index % 2 === 0 ? "justify-start" : "justify-end";
  const img = (player) ? player.img_src : unknownPlayerImgSrc;
  let bg = "bg-gray-200";
  if (!isMe && player) {
    bg = "bg-green-300";
    borderStyle = "border-green-500";
  }
  return (
    <div
      className={`${bg} text-primary rounded border-2  ${borderStyle}`}
    >
      <div className={`flex items-center bg-secondary px-5 py-2 ${alignDir}`}>
        <div className="relative">
          <UserProfilePic size={10} user={user} isMe={isMe} hasName={false} />
          {/* نقطة خضراء تومض عند التحدث */}
          {isSpeaking && !isMuted && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white animate-ping" />
          )}
        </div>
        <button
          onClick={() => isMe && onToggleMic?.()}
          disabled={!isMe}
          title={isMe ? (isMuted ? "Unmute Mic" : "Mute Mic") : ""}
          className={`ml-3 p-2 rounded-full transition-all ${isMe ? 'hover:bg-white/20 cursor-pointer active:scale-90' : 'cursor-default'
            } ${isMuted ? 'bg-red-100 text-red-600' : isSpeaking ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} className={isSpeaking ? "animate-pulse" : ""} />}
        </button>
      </div>
      <div
        className={`w-full flex items-center h-[20rem]  p-5 justify-center overflow-hidden p-[2px] relative bg-gray-50`}
      >
        <img src={img} className="w-full h-full" alt={player?.name} />
      </div>
      <div>
        {isMe || player ?
          <p className="text-2xl text-center p-3 font-bold">{player?.name || ""}</p>
          :
          <GuessThePlayerSearch assignmentId={assignmentId} />
        }
      </div>
    </div>
  );
}
