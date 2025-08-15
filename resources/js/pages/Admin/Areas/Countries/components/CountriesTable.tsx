import { useDeleteByIdMutation, useGetDataQuery, useUpdateByIdMutation } from "@/services/api";
import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";

export default function CountriesTable() {
    const columns: EditableColumnDef<Country>[] = [
        {
            accessorKey: "name",
            header: "Name",
            size: 2,
            enableEditing: true,
            cell: ({ row }) => <b>{row.original.name}</b>,
        },
        {
            accessorKey: "code",
            header: "Code",
            enableEditing: true,
        },
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
        {
            accessorKey: "popularity",
            header: "Popularity",
            enableEditing: true,

        },
    ];

    return (
        <GenericTable<Country>
            title="Countries"
            url="/api/v1/admin/countries"
            itemName="Country"
            columns={columns}
            useGetHook={useGetDataQuery}
            useUpdateHook={useUpdateByIdMutation}
            useDeleteHook={useDeleteByIdMutation}
            enableEditing
            enableDeleting
        />
    );
}
