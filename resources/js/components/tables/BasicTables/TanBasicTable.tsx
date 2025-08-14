import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";
import { PiCaretDoubleLeftBold, PiCaretDoubleRightBold, PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { PiCaretUpBold, PiCaretDownBold } from "react-icons/pi";

interface TableTemplateProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    total: number;
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    search: string;
    title: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    loading?: boolean;
}

export default function TableTemplate<TData>({
    columns,
    data,
    total,
    pagination,
    search,
    title,
    setSearch,
    sorting,
    setSorting,
    setPagination,
    loading = false,
}: TableTemplateProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        state: { pagination, sorting },
        manualPagination: true,
        manualSorting: true,
        pageCount: Math.ceil(total / pagination.pageSize),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-1 rounded-lg bg-primary">
            <div className="py-2 px-3 flex items-center border-b-2 border-red-800 justify-between">
                <h4 className="text-2xl font-bold text-white">{title}</h4>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setPagination((prev) => ({ ...prev, pageIndex: 0 })); // reset to first page
                        setSearch(e.target.value);
                    }}
                    placeholder="Search..."
                    className="border p-2 rounded w-64"
                />
                
            </div>
            <table className="min-w-full">
                <thead className="bg-primary text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-3 py-3 uppercase border-b border-gray-300 text-left"
                                >
                                    <div
                                        className="flex items-center gap-1 cursor-pointer select-none"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === "asc" && <PiCaretUpBold size={14} />}
                                        {header.column.getIsSorted() === "desc" && <PiCaretDownBold size={14} />}
                                        {!header.column.getIsSorted() && header.column.getCanSort() && (
                                            <span className="text-gray-400">
                                                <PiCaretUpBold size={10} style={{ transform: "translateY(2px)" }} />
                                                <PiCaretDownBold size={10} style={{ transform: "translateY(-2px)" }} />
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-accent text-steel-gray">
                    {loading ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="p-4 text-center"
                            >
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-3 py-2 border-b border-gray-200"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 py-4 items-center text-white">
                <button
                    className="flex items-center justify-center w-[30px] h-[30px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <PiCaretDoubleLeftBold size={20} fontWeight={900} />
                </button>
                <button
                    className="flex items-center justify-center w-[40px] h-[40px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <PiCaretLeftBold size={20} fontWeight={900} />
                </button>
                <span>
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                    className="flex items-center justify-center w-[40px] h-[40px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <PiCaretRightBold size={20} fontWeight={900} />
                </button>

                <button
                    className="flex items-center justify-center w-[30px] h-[30px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <PiCaretDoubleRightBold size={20} fontWeight={900} />
                </button>
            </div>
        </div>
    );
}
