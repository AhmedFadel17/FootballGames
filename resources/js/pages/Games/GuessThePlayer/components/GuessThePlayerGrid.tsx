import GuessThePlayerCard from "./GuessThePlayerCard";

interface GuessThePlayerGridProps {
  totalPlayers: number;
}

export default function GuessThePlayerGrid({ totalPlayers}: GuessThePlayerGridProps) {
  return (
    <div className="border-4 border p-4 rounded border-primary">
    <div
      className="grid grid-cols-2 gap-5 min-h-[30rem] "
    >
      {Array.from({ length: totalPlayers }).map((_, index) => {
        return (
          <GuessThePlayerCard
            key={index}
            index={index}
            imgSrc={index===0?"https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-during-the-uefa-nations-news-photo-1748359673.pjpeg?crop=0.610xw:0.917xh;0.317xw,0.0829xh&resize=640:*":null}
            user={{
                username:"ahmed",
                avatar:"https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
            }}
            isMe={index===0?true:false}
          />
        );
      })}
    </div>
    </div>
  );
}
