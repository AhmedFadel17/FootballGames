import TableTemplate from '@/components/tables/BasicTables/TanBasicTable';
import { useGetDataQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { addItem, TopListItem } from '@/store/slices/admin/adminTopListSlice';
import { EditableColumnDef } from '@/types/table';
import { PaginationState, SortingState } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';




export const Selector = () => {
    const {objectUrl,title} = useAppSelector((state) => state.adminTopList);

    const dispatch = useAppDispatch();
    const handleItemClick = (v: any) => {
        dispatch(addItem(v))
    }
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    const [dataList, setDataList] = useState<TopListItem[]>([]);
    const columns: EditableColumnDef<TopListItem>[] = [
        {
            accessorKey: "name", header: "Name", enableSorting: false, size: 2,
            cell: ({ row }) => (
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleItemClick(row.original)}>
                    <img
                        src={row.original.img_src}
                        alt={row.original.name}
                        className="w-8 h-8 rounded"
                    />
                    <p>{row.original.name}</p>
                </div>

            ),
        },
    ];
    const { data, isLoading, isSuccess, refetch } = useGetDataQuery({
        url: `/api/v1/admin/${objectUrl}`, params: {
            search: search,
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
        }
    });

    useEffect(() => {
        if (isSuccess && data) {
            setDataList(data.data);
            setTotal(data.meta.total_records);
        }
    }, [isSuccess, data]);
    return (
        <div className="rounded bg-white p-4 border-2 border-primary">
            <h2 className="text-2xl font-bold mb-4">Selector</h2>

            <div className="overflow-x-auto">
                <TableTemplate<TopListItem>
                    title=""
                    itemName={title || ''}
                    columns={columns}
                    data={dataList}
                    total={total}
                    pagination={pagination}
                    setPagination={setPagination}
                    search={search}
                    setSearch={setSearch}
                    loading={isLoading}
                    sorting={sorting}
                    setSorting={setSorting}
                    enableSearch
                    paginate
                />

            </div>

        </div>
    );
};

