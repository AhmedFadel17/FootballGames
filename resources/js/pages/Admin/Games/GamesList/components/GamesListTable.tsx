import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { RedixModalInputProps } from "@/components/modals/RedixModal";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<Game>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "slug", header: "Slug", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "min_players", header: "Min Players", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "max_players", header: "Max Players", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "description", header: "Description", enableEditing: true, enableSorting: false, size: 2 },


];

const fields = [
    { name: "name", label: "Name", type: 'text' },
    { name: "slug", label: "Slug", type: 'text' },
    { name: "min_players", label: "Min Players", type:"number" },
    { name: "max_players", label: "Max Players", type:"number" },
    { name: "description", label: "Description",type:"text" },
]
export default function GamesListTable() {
    return (
        <GenericTable<Game>
            title="Games"
            url="/api/v1/admin/games"
            itemName="Game"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding
            paginate={false}
            enableSearch={false}
            fields={fields}
        />
    );
}
