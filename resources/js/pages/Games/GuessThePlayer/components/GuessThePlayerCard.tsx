import UserProfilePic from "@/pages/Dashboard/Multi/components/UserProfilePic";
import TopListSearch from "../../TopList/components/TopListSearch";
import GuessThePlayerSearch from "./GuessThePlayerSearch";
const unknownPlayerImgSrc = "https://icon-library.com/images/2018/2503231_sharks-player-profile-silhouette-hd-png-download.png";

interface GuessThePlayerCardProps {
  isMe: boolean,
  user: User | null,
  index: number,
  player: Player | null,
  assignmentId:number
}

export default function GuessThePlayerCard({ assignmentId,index, player, user, isMe = true }: GuessThePlayerCardProps) {
  let borderStyle = isMe ? "border-blue-500" : "border-gray-300";
  const alignDir = index % 2 === 0 ? "justify-start" : "justify-end";
  const img = (player) ? player.img_src : unknownPlayerImgSrc;
  let bg="bg-gray-200";
  if(!isMe && player){
    bg= "bg-green-300";
    borderStyle="border-green-500";
  }
  return (
    <div
      className={`${bg} text-primary rounded border-2  ${borderStyle}`}
    >
      <div className={`flex items-center bg-secondary px-5 py-2 ${alignDir}`}>
        <UserProfilePic size={10} user={user} isMe={isMe} hasName={false} />
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
