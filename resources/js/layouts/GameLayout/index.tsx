import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { connectEcho } from "@/lib/echo";
import { useAppSelector, useAppDispatch } from "@/store";
import { setOnlineUsers, userJoined, userLeft } from "@/store/slices/roomSlice";

export default function GameLayout() {
    const { token } = useAppSelector((state) => state.auth);
    const { currentInstance } = useAppSelector((state) => state.room);
    const dispatch = useAppDispatch();
    const [channel, setChannel] = useState<any>(null);

    useEffect(() => {
        if (!token || !currentInstance?.id) return;

        const echo = connectEcho(token);
        const channelName = `room.${currentInstance.id}`;

        const presenceChannel = echo.join(channelName)
            .here((users: any[]) => dispatch(setOnlineUsers(users)))
            .joining((u: any) => dispatch(userJoined(u)))
            .leaving((u: any) => dispatch(userLeft(u.id)));

        setChannel(presenceChannel);

        return () => {
            console.log("Completely leaving the game scope...");
            echo.leave(channelName);
        };
    }, [currentInstance?.id, token]);

    return (
        <div className="game-container">
            <Outlet context={{ channel }} />
        </div>
    );
}