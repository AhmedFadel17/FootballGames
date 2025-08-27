import { useEffect, useState } from "react";
import Input from "@/components/form/input/InputField";
import { FaSearch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import { setItem } from "@/store/slices/topListGameSlice";
import axios from "axios";
import { useCreateDataMutation, useGetDataQuery } from "@/services/api";
import toast from "react-hot-toast";


export default function TopListSearch() {
    const dispatch = useAppDispatch();
    const game = useAppSelector((state) => state.toplist.game);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Player[]>([]);
    const { data, isLoading:loading, isSuccess } = useGetDataQuery({
        url: "/api/v1/u/players",
        params: {
            search: query
        }
    });

    const [createData] = useCreateDataMutation();

    useEffect(() => {
        if (isSuccess && data) {
            setResults(data.data ?? []);
        }
    }, [isSuccess, data]);


    const handleSearch = async (q: string) => {
        setQuery(q);
        if (q.length < 2) {
            setResults([]);
            return;
        }
    };

    const handleSelect = async (id:number) => {
        if (!game) return;

        await toast.promise(
            createData({
                url: `/api/v1/u/games-list/top-list/${game.id}/check/${id}`,
                body: {},
            }).unwrap(),
            {
                loading: "submitting...",
                success: "right answer!",
            }
        ).then((item) => {
            dispatch(setItem(item));
            setQuery("")
            setResults([])
        });
    };

    return (
        <div className="w-full p-4">
            <div className="relative">
                <Input
                    type="search"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search player..."
                    className="pr-10"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />

                {results.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
                        {results.map((player) => (
                            <li
                                key={player.id}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelect(player.id)}
                            >
                                {player.name}
                            </li>
                        ))}
                    </ul>
                )}

                {loading && (
                    <div className="absolute mt-1 bg-white p-2 rounded shadow text-sm">
                        Searching...
                    </div>
                )}
            </div>
        </div>
    );
}
