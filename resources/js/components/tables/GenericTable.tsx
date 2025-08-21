import React, { useState, useEffect, useMemo } from "react";
import TableTemplate from "@/components/tables/BasicTables/TanBasicTable";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import { EditableColumnDef } from "@/types/table";
import RedixModal, { RedixModalInputProps } from "@/components/modals/RedixModal";
import { useCreateDataMutation, useDeleteByIdMutation, useGetDataQuery, useUpdateByIdMutation } from "@/services/api";

interface GenericTableProps<T> {
    title?: string;
    url: string;
    columns: EditableColumnDef<T>[];
    itemName: string;
    enableEditing?: boolean;
    enableDeleting?: boolean;
    enableAdding?: boolean;
    paginate?: boolean;
    enableSearch?:boolean;
    fields?: RedixModalInputProps[];
}

export default function GenericTable<T extends { id: string | number }>({
    title,
    url,
    columns,
    itemName,
    enableEditing = false,
    enableDeleting = false,
    enableAdding = false,
    paginate = true,
    enableSearch=true,
    fields = []

}: GenericTableProps<T>) {

    const [dataList, setDataList] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [debouncedSearch] = useDebounce(search, 300);
    const [showModal, setShowModal] = useState(false);
    const params = useMemo(() => {
        const p: Record<string, any> = {
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
            search: debouncedSearch,
            sort_by: sorting[0]?.id,
            sort_order: sorting[0]?.desc ? "desc" : "asc",
        };
        Object.keys(p).forEach((key) => {
            if (!p[key]) delete p[key];
        });
        return p;
    }, [pagination, debouncedSearch, sorting]);

    const { data, isLoading, isSuccess, refetch } = useGetDataQuery({ url, params });
    const [updateItem] = enableEditing ? useUpdateByIdMutation() : [null];
    const [deleteItem] = enableDeleting ? useDeleteByIdMutation() : [null];
    const [createItem] = enableAdding ? useCreateDataMutation() : [null];

    const handleSave = async (id: string | number, updatedRow: Partial<T>) => {
        if (!updateItem) return;
        await toast.promise(
            updateItem({ url, id, body: updatedRow }).unwrap(),
            {
                loading: `Saving ${itemName}...`,
                success: `${itemName} updated successfully ✅`,
                error: `Failed to save ${itemName} ❌`,
            }
        );
        refetch();
    };

    const handleDelete = async (id: string | number) => {
        if (!deleteItem) return;
        await toast.promise(
            deleteItem({ url, id }).unwrap(),
            {
                loading: `Deleting ${itemName}...`,
                success: `${itemName} deleted successfully 🗑️`,
                error: `Failed to delete ${itemName} ❌`,
            }
        );
        refetch();
    };

    const handleAdding = async (body: any) => {
        if (!createItem) return;
        await toast.promise(
            createItem({ url, body }).unwrap(),
            {
                loading: `Adding ${itemName}...`,
                success: `${itemName} added successfully`,
                error: `Failed to add ${itemName} ❌`,
            }
        );
        refetch();
    };

    useEffect(() => {
        if (isSuccess && data) {
            if (paginate) {
                setDataList(data.data);
                setTotal(data.meta.total_records);
            } else {
                setDataList(data);
                setTotal(data.length);
            }

        }
    }, [isSuccess, data]);

    return (
        <div>
            {enableAdding &&
                <>
                    <div className="py-4 flex items-center justify-between border-b-2 border-red-800 bg-steel-gray px-4 rounded-t-lg">
                        <h4 className="text-2xl font-bold text-white capitalize">{title}</h4>
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => setShowModal(true)}
                                className="btn bg-white text-primary rounded-full border border-primary hover:border-white hover:bg-secondary hover:text-primary sm:min-w-64 py-2 px-4 uppercase font-bold"
                            >
                                add {itemName}
                            </button>
                        </div>

                    </div>
                    <RedixModal<T>
                        title={"Add " + itemName}
                        fields={fields}
                        onAdd={handleAdding}
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        size="lg"
                    />
                </>
            }


            <TableTemplate<T>
                title={!enableAdding ? title : undefined}
                itemName={itemName}
                columns={columns}
                data={dataList}
                total={total}
                pagination={pagination}
                setPagination={setPagination}
                search={search}
                setSearch={setSearch}
                sorting={sorting}
                setSorting={setSorting}
                loading={isLoading}
                enableEditing={enableEditing}
                onSave={enableEditing ? handleSave : undefined}
                enableDeleting={enableDeleting}
                onDelete={enableDeleting ? handleDelete : undefined}
                enableSearch={enableSearch}
                paginate={paginate}
            />


        </div>
    );
}

