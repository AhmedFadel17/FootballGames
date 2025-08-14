import React, { useState, useEffect, useMemo } from "react";
import TableTemplate from "@/components/tables/BasicTables/TanBasicTable";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { useGetDataQuery } from "@/services/api";
import { useDebounce } from "use-debounce";

export default function CountriesTable() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [debouncedSearch] = useDebounce(search, 300);

    const params = useMemo(() => {
        const p: Record<string, any> = {
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
            search: debouncedSearch,
            sort_by: sorting[0]?.id,
            sort_order: sorting[0]?.desc ? "desc" : "asc",
        };
        Object.keys(p).forEach((key) => {
            if (p[key] === undefined || p[key] === null || p[key] === "") {
                delete p[key];
            }
        });
        return p;
    }, [pagination, debouncedSearch,  sorting]);

    const { data, isLoading, isSuccess } = useGetDataQuery({
        url: "/api/v1/admin/countries",
        params
    });

    const columns: ColumnDef<Country>[] = [
        { accessorKey: "id", header: "ID" },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <b>{row.original.name}</b>,
        },
        { accessorKey: "code", header: "Code" },
        {
            accessorKey: "img_src",
            header: "Flag",
            enableColumnFilter: false,
            enableSorting: false,
            cell: ({ row }) => (
                <img
                    src={row.original.img_src}
                    alt={row.original.name}
                    className="w-8 h-8 object-cover rounded"
                />
            ),
        },
        { accessorKey: "popularity", header: "Popularity" },
    ];

    useEffect(() => {
        if (isSuccess && data) {
            setCountries(data.data);
            setTotal(data.meta.total_records);
        }
    }, [isSuccess, data]);

    return (
        <TableTemplate<Country>
            title="Countries"
            columns={columns}
            data={countries}
            total={total}
            pagination={pagination}
            setPagination={setPagination}
            search={search}
            setSearch={setSearch}
            sorting={sorting}
            setSorting={setSorting}
            loading={isLoading}
        />
    );
}
