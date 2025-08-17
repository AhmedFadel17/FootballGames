import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";

const columns: EditableColumnDef<Team>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "short_name", header: "Short Name", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "abbr", header: "Abbreviation", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "country.name", header: "Country", enableEditing: false, enableSorting: false, size: 1 },
    { accessorKey: "img_src", header: "Image", enableEditing: true, enableSorting: false, size: 1 },
];

export default function TeamsTable() {
    const [fields, setFields] = useState<any>([]);
    const { data: countriesData, isLoading: countriesLoading, isSuccess: countriesSuccess } = useGetDataQuery({
        url: "/api/v1/admin/options/countries",
    });

    useEffect(() => {
        if (countriesSuccess && countriesData) {
            let countriesOptions = countriesData.map((row: Country) => ({ value: row.id, label: row.name }));
            setFields([
                { name: "name", label: "Name", type: 'text' },
                { name: "short_name", label: "Short Name", type: 'text' },
                { name: "abbr", label: "Abbreviation", type: 'text' },
                { name: "country_id", label: "Country", type: "select", options: countriesOptions },
                { name: "img_src", label: "Image URL", type: 'text' },
            ]);
        }
    }, [countriesSuccess, countriesData]);

    if (countriesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GenericTable<Team>
            title="Teams"
            url="/api/v1/admin/teams"
            itemName="Team"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding
            fields={fields}
        />
    );
}
