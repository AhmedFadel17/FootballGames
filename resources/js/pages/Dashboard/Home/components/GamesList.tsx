import { useGetGamesQuery } from "@/store/apis";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Feedback/StatusScreens";
import { Game } from "@/types";
import { GenericDataGrid } from "@/components/ui/Grids/GenericDataGrid";
import { GameCard } from "@/components/ui/Cards/GameCard";


export default function GamesList() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');


    const [queryState, setQueryState] = useState({
        filters: {} as Record<string, any>,
        orderBy: 'created_at' as string | undefined,
        sortOrder: 'desc' as 'asc' | 'desc' | undefined,
    });

    const { data: response, isLoading, isError, refetch } = useGetGamesQuery({
        page,
        per_page: pageSize,
        ...queryState.filters,
        sort_by: queryState.orderBy,
        sort_order: queryState.sortOrder,
        search: searchTerm,
    });
    if (isLoading) return <LoadingScreen message="Loading games..." />;
    if (isError) return <ErrorScreen title="Failed to fetch games" message="Please try again." />;

    const gamesData = response?.data;
    const games: Game[] = gamesData?.items || [];

    return (
        <GenericDataGrid<Game>
            items={games}
            isLoading={isLoading}
            error={isError}
            loadingMessage="Loading games..."
            errorTitle="Network Error"
            errorMessage="Failed to fetch games. Please try again."
            emptyStateMessage="No game parameters found matching your filters."
            renderItem={(game) => <GameCard game={game} />}
            searchOption={{
                placeholder: "Search games catalog...",
                value: searchTerm,
                onChange: (val) => { setSearchTerm(val); setPage(1); }
            }}
            filterOptions={{
                fields: [],
                values: queryState.filters,
                onChange: (nextFilters) => {
                    setQueryState(prev => ({ ...prev, filters: nextFilters }));
                    setPage(1);
                }
            }}
            paginationData={gamesData}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            cols={{ sm: 1, md: 2, lg: 4 }}
        />
    );
}
