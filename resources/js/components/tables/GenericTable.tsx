import React, { useState, useEffect, useMemo } from "react";
import TableTemplate from "@/components/tables/BasicTables/TanBasicTable";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import { EditableColumnDef } from "@/types/table";

interface GenericTableProps<T> {
  title: string;
  url: string;
  columns: EditableColumnDef<T>[];
  itemName: string;
  useGetHook: any;   // RTK Query hook for GET
  useUpdateHook?: any; // RTK Query hook for UPDATE
  useDeleteHook?: any; // RTK Query hook for DELETE
  enableEditing?: boolean;
  enableDeleting?: boolean;
}

export default function GenericTable<T extends { id: string | number }>({
  title,
  url,
  columns,
  itemName,
  useGetHook,
  useUpdateHook,
  useDeleteHook,
  enableEditing = false,
  enableDeleting = false,
}: GenericTableProps<T>) {
  
  const [dataList, setDataList] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
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
      if (!p[key]) delete p[key];
    });
    return p;
  }, [pagination, debouncedSearch, sorting]);

  const { data, isLoading, isSuccess, refetch } = useGetHook({ url, params });
  const [updateItem] = useUpdateHook ? useUpdateHook() : [null];
  const [deleteItem] = useDeleteHook ? useDeleteHook() : [null];

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

  useEffect(() => {
    if (isSuccess && data) {
      setDataList(data.data);
      setTotal(data.meta.total_records);
    }
  }, [isSuccess, data]);

  return (
    <TableTemplate<T>
      title={title}
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
    />
  );
}
