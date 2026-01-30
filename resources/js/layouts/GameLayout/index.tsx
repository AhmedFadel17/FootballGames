import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { connectEcho } from "@/lib/echo";
import { useAppSelector, useAppDispatch } from "@/store";
import { setOnlineUsers, userJoined, userLeft, startGame } from "@/store/slices/roomSlice";
import { useLazyGetDataQuery } from "@/services/api";

export default function GameLayout() {
    const { token } = useAppSelector((state) => state.auth);
    const { currentInstance, game } = useAppSelector((state) => state.room);
    const dispatch = useAppDispatch();
    
    const [channel, setChannel] = useState<any>(null);
    const [isStarting, setIsStarting] = useState(false);

    const [triggerFetchGame] = useLazyGetDataQuery();

    const initiateGameStart = useCallback(async () => {
        if (!currentInstance || isStarting) return;
        
        setIsStarting(true);
        try {
            const result = await triggerFetchGame({
                url: `/api/v1/u/games-list/guess-the-player/instance/${currentInstance.id}`,
            }).unwrap();

            // تحديث الـ Slices
            dispatch(startGame(result.instance));
            if (game?.sliceName) {
                dispatch({ type: `${game.sliceName}/startGame`, payload: result });
            }

        } catch (error) {
            console.error("Sync error:", error);
            setIsStarting(false);
        }
    }, [currentInstance, game, dispatch, triggerFetchGame, isStarting]);

    useEffect(() => {
    if (currentInstance?.status === 'active' && !isStarting) {
        console.log("Game already active, triggering sync...");
        initiateGameStart();
    }
}, [currentInstance?.status, initiateGameStart, isStarting]);
    useEffect(() => {
        if (!token || !currentInstance?.id) return;

        const echo = connectEcho(token);
        const channelName = `room.${currentInstance.id}`;
        const presenceChannel = echo.join(channelName)
            .here((users: any[]) => dispatch(setOnlineUsers(users)))
            .joining((u: any) => dispatch(userJoined(u)))
            .leaving((u: any) => dispatch(userLeft(u.id)));

        presenceChannel.listen('.game.started', () => {
            console.log("Start signal received in Layout");
            initiateGameStart();
        });

        presenceChannel.listen('.game.action', (data: any) => {
            const { action, payload } = data;
            if (action === 'assignment.solved' && game?.sliceName) {
                dispatch({
                    type: `${game.sliceName}/solveAssignment`,
                    payload: payload.assignment
                });
            }
        });

        setChannel(presenceChannel);
        return () => { echo.leave(channelName); };
    }, [currentInstance?.id, token, game?.sliceName, initiateGameStart]);

    return (
        <div className="game-container">
            <Outlet context={{ channel, isStarting }} />
        </div>
    );
}