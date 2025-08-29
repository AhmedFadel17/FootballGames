import { useEffect, useState } from "react";
import Input from "@/components/form/input/InputField";
import { FaSearch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import { submitAnswer } from "@/store/slices/topListGameSlice";
import { useCreateDataMutation, useGetDataQuery } from "@/services/api";
import toast from "react-hot-toast";

export default function TopListSearch() {
  const dispatch = useAppDispatch();
  const { id: gameId, game } = useAppSelector((state) => state.toplist);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);

  const { data, isLoading: loading, isSuccess } = useGetDataQuery({
    url: "/api/v1/u/players",
    params: {
      search: debouncedQuery,
    },
  },{skip: debouncedQuery.length < 3});

  const [createData] = useCreateDataMutation();

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (isSuccess && data) {
      setResults(data.data ?? []);
    }
  }, [isSuccess, data]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 3) {
      setResults([]);
    }
  };

  const handleSelect = async (id: number) => {
    if (!game) return;

    await toast
      .promise(
        createData({
          url: `/api/v1/u/games-list/top-list/${gameId}/check/${id}`,
          body: {},
        }).unwrap(),
        {
          loading: "Submitting...",
        }
      )
      .then((answer) => {
        dispatch(submitAnswer(answer));
        setQuery("");
        setResults([]);
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
