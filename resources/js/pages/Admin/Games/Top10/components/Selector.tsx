

import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import InputLabel from '@/components/InputLabel';
import TableTemplate from '@/components/tables/BasicTables/TanBasicTable';
import { ArrowDownIcon, ArrowUpIcon, CloseIcon } from '@/icons';
import { useGetDataQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { addItem, Top10Item } from '@/store/slices/admin/adminTop10Slice';
import { EditableColumnDef } from '@/types/table';
import { PaginationState, SortingState } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';




export const Selector = () => {
    const objectUrl = useAppSelector((state) => state.adminTop10.objectUrl);
    const title = useAppSelector((state) => state.adminTop10.objectType);

    const dispatch = useAppDispatch();
    const handleItemClick = (v: any) => {
        dispatch(addItem(v))
    }
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);

    const [dataList, setDataList] = useState<Top10Item[]>([]);
    const columns: EditableColumnDef<Top10Item>[] = [
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
        // { accessorKey: "date_of_birth", header: "DOT", enableEditing: true, enableSorting: false, size: 1 },
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
                <TableTemplate<Top10Item>
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

