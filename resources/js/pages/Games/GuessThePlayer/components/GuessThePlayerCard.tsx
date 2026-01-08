import UserProfilePic from "@/pages/Dashboard/Multi/components/UserProfilePic";
const unknownPlayerImgSrc="https://icon-library.com/images/2018/2503231_sharks-player-profile-silhouette-hd-png-download.png";

interface GuessThePlayerCardProps {
  isMe: boolean,
  user: User | null,
  index:number,
  imgSrc:string|null,
}

export default function GuessThePlayerCard({ index,imgSrc,user, isMe = true }: GuessThePlayerCardProps) {
  const borderStyle = isMe ? "border-green-500" : "border-blue-500";
  const alignDir=index%2===0?"justify-start":"justify-end";
  const img=imgSrc??unknownPlayerImgSrc;
  return (
    <div
      className={`bg-gray-300 text-primary rounded p-5 border-2  ${borderStyle}`}
    >
      <div className={`flex items-center ${alignDir}`}>
        <UserProfilePic size={10} user={user} isMe={isMe} />
        
      </div>
        <div
        className={`w-full flex items-center justify-center overflow-hidden p-[2px] relative bg-gray-50`}
      >
        <img src={img}/>
      </div>
    </div>
  );
}
