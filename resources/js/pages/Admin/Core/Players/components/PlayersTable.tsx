import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<Player>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "fullname", header: "Full Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "position", header: "Position", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "date_of_birth", header: "Date of Birth", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "country.name", header: "Country", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "popularity", header: "Popularity", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "img_src", header: "Image", enableEditing: true, enableSorting: false, size: 1 },
];

export default function PlayersTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: countriesData, isLoading: countriesLoading, isSuccess: countriesSuccess } = useGetDataQuery({
        url: "/api/v1/admin/options/countries",
    });

    useEffect(() => {
        if (countriesSuccess && countriesData) {
            let countriesOptions = countriesData.map((row: Country) => ({ value: row.id, label: row.name }));
            setFields([
                { name: "name", label: "Name", type: 'text' },
                { name: "fullname", label: "Full Name", type: 'text' },
                { name: "position", label: "Position", type: 'text' },
                { name: "date_of_birth", label: "Date of Birth", type: 'date' },
                { name: "country_id", label: "Country", type: "select", options: countriesOptions },
                { name: "popularity", label: "Popularity", type: 'number' },
                { name: "img_src", label: "Image URL", type: 'text' },
            ]);
        }
    }, [countriesSuccess, countriesData]);

    if (countriesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GenericTable<Player>
            title="Players"
            url="/api/v1/admin/players"
            itemName="Player"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding
            fields={fields}
        />
    );
}
