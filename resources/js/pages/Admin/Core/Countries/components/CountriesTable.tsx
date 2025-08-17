import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<Country>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "code", header: "Code", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "continent.name", header: "Continent", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "popularity", header: "Popularity", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "img_src", header: "Flag", enableEditing: false, enableSorting: false, size: 1 },
];

export default function CountriesTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: continentsData, isLoading: continentsLoading, isSuccess: continentsSuccess } = useGetDataQuery({
        url: "/api/v1/admin/continents",
    });

    useEffect(() => {
        if (continentsSuccess && continentsData) {
            let continentsOptions = continentsData.map((row: Continent) => ({ value: row.id, label: row.name }));
            setFields([
                { name: "name", label: "Name", type: 'text' },
                { name: "code", label: "Code", type: 'text' },
                { name: "continent_id", label: "Continent", type: "select", options: continentsOptions },
                { name: "popularity", label: "Popularity", type: 'number' },
            ]);
        }
    }, [continentsSuccess, continentsData]);

    if (continentsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GenericTable<Country>
            title="Countries"
            url="/api/v1/admin/countries"
            itemName="Country"
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