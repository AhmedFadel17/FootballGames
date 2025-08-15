import React, { useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";
import {
    PiCaretDoubleLeftBold,
    PiCaretDoubleRightBold,
    PiCaretLeftBold,
    PiCaretRightBold,
    PiCaretUpBold,
    PiCaretDownBold,
    PiPencilSimpleBold,
    PiXBold,
    PiCheckBold,
    PiTrashBold,
} from "react-icons/pi";
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaPen, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

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
    enableDeleting?: boolean;
    enableEditing?: boolean;
    onSave?: (rowId: string | number, updatedRow: any) => Promise<void> | void;
    onDelete?: (rowId: string | number) => Promise<void> | void;

}

export default function TableTemplate<TData extends { id: string | number }>({
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
    onSave,
    onDelete,
    enableDeleting,
    enableEditing
}: TableTemplateProps<TData>) {
    const [editingRowId, setEditingRowId] = useState<string | number | null>(null);
    const [editValues, setEditValues] = useState<Record<string, any>>({});
    const [originalRow, setOriginalRow] = useState<any>(null);
    const hasActionsColumn = (enableDeleting || enableEditing);
    const totalSizeParts = columns.reduce((sum, col) => sum + (hasActionsColumn ? 1 : 0) + (col.size || 1), 0);

    const table = useReactTable({
        data,
        columns,
        state: { pagination, sorting },
        manualPagination: true,
        manualSorting: true,
        pageCount: Math.ceil(total / pagination.pageSize),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        defaultColumn: {
            minSize: 100,
            size: 1,
        },
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (editingRowId) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [editingRowId]);

    const startEditing = (row: any) => {
        if (!enableEditing) return;
        setEditingRowId(row.id);
        setOriginalRow(row);
        setEditValues({ ...row });
    };

    const cancelEditing = () => {
        setEditingRowId(null);
        setEditValues({});
        setOriginalRow(null);
    };

    const saveEditing = async () => {
        if (!enableEditing) return;
        if (onSave && editingRowId) {
            await onSave(editingRowId, editValues);
        }
        cancelEditing();
    };


    const handleDelete = async (id: string | number) => {
        if (!enableDeleting || !onDelete) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            await onDelete(id);
        }
    };




    return (
        <div className="p-1 rounded-lg bg-primary">
            <Toaster position="top-right" />

            {/* Title + Search */}
            <div className="py-2 px-3 flex items-center border-b-2 border-red-800 justify-between">
                <h4 className="text-2xl font-bold text-white">{title}</h4>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        setSearch(e.target.value);
                    }}
                    placeholder="Search..."
                    className="border p-2 rounded w-64"
                />
            </div>

            {/* Table */}
            <table className="w-full table-fixed">
                <thead className="bg-primary text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    style={{
                                        width: `${((header.column.columnDef.size || 1) / totalSizeParts) * 100}%`
                                    }}
                                    className="sm:px-3 py-3 uppercase text-left"
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
                            {hasActionsColumn &&
                                <th className="sm:px-3 py-3"
                                    style={{
                                        width: `${(1 / totalSizeParts) * 100}%`
                                    }}
                                >Actions</th>
                            }
                        </tr>
                    ))}
                </thead>

                <tbody className="bg-accent text-steel-gray">
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="p-4 text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => {
                            const isEditing = editingRowId === row.original.id;
                            return (
                                <tr
                                    key={row.id}
                                    className={`hover:bg-gray-50 group ${isEditing ? "bg-gray-800" : ""
                                        }`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            style={{
                                                width: `${((cell.column.columnDef.size || 1) / totalSizeParts) * 100}%`
                                            }}
                                            className="px-3 py-2 border-b border-gray-200 gap-4"
                                            onDoubleClick={() => startEditing(row.original)}
                                        >
                                            {(isEditing && cell.column.columnDef.enableEditing === true) ? (
                                                <input
                                                    value={editValues[cell.column.id] ?? ""}
                                                    onChange={(e) =>
                                                        setEditValues((prev) => ({
                                                            ...prev,
                                                            [cell.column.id]: e.target.value,
                                                        }))
                                                    }
                                                    // onBlur={() => saveEditing()}
                                                    className="border p-1 rounded w-full"
                                                />
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                        </td>
                                    ))}
                                    {hasActionsColumn &&
                                        <td className="sm:px-3 py-2 border-b border-gray-200"
                                            style={{
                                                width: `${(1 / totalSizeParts) * 100}%`
                                            }}>
                                            {isEditing && enableEditing ? (
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={saveEditing}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <PiCheckBold size={18} />
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <PiXBold size={18} />
                                                    </button>

                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4 justify-center">
                                                    {enableEditing &&
                                                        <button
                                                            onClick={() => startEditing(row.original)}
                                                            className="bg-blue-500 rounded text-white p-1"
                                                        >
                                                            <FaPen size={16} />
                                                        </button>
                                                    }
                                                    {enableDeleting &&
                                                        <button
                                                            onClick={() => handleDelete(row.original.id)}
                                                            className="bg-red-500 rounded text-white p-1"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    }
                                                </div>
                                            )}
                                        </td>
                                    }
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center gap-4 py-4 items-center text-white">
                <button
                    className="flex items-center justify-center w-[30px] h-[30px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <PiCaretDoubleLeftBold size={20} />
                </button>
                <button
                    className="flex items-center justify-center w-[40px] h-[40px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <PiCaretLeftBold size={20} />
                </button>
                <span>
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                    className="flex items-center justify-center w-[40px] h-[40px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <PiCaretRightBold size={20} />
                </button>
                <button
                    className="flex items-center justify-center w-[30px] h-[30px] bg-white text-primary rounded-full disabled:opacity-50"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <PiCaretDoubleRightBold size={20} />
                </button>
            </div>
        </div>
    );
}
