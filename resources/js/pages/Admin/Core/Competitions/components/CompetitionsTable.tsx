import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";
import { FaDotCircle } from "react-icons/fa";

const columns: EditableColumnDef<Competition>[] = [
    { accessorKey: "name", header: "Name", enableEditing: true, enableSorting: false, size: 2 },
    { accessorKey: "short_name", header: "Abbr.", enableEditing: true, enableSorting: false, size: 1 },
    {
        accessorKey: "country.name", header: "Country", enableEditing: false, enableSorting: false, size: 1, cell: ({ row }) => (
            <img
                src={row.original.country?.img_src}
                alt={row.original.country?.name}
                className="w-8 h-8 object-cover rounded"
            />
        ),
    },
    { accessorKey: "type", header: "Type", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "founded_year", header: "FY", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "tier", header: "Tier", enableEditing: true, enableSorting: false, size: 1 },
    { accessorKey: "popularity", header: "Popularity", enableEditing: true, enableSorting: false, size: 1 },
    {
        accessorKey: "is_active", header: "Active", enableEditing: true, enableSorting: false, size: 1, cell: ({ row }) => (
            <span className={` ${row.original.is_active ? "text-green-500" : "text-gray-500"}`}><FaDotCircle /></span>
        ),
    },
    {
        accessorKey: "img_src", header: "Image", enableEditing: true, enableSorting: false, size: 1, cell: ({ row }) => (
            <img
                src={row.original.img_src}
                alt={row.original.name}
                className="w-8 h-8 rounded"
            />
        ),
    },
];

export default function CompetitionsTable() {
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
                { name: "country_id", label: "Country", type: "select", options: countriesOptions },
                { name: "type", label: "Type", type: 'text' },
                { name: "founded_year", label: "Founded Year", type: 'number' },
                { name: "tier", label: "Tier", type: 'number' },
                { name: "popularity", label: "Popularity", type: 'number' },
                { name: "is_active", label: "Active", type: 'checkbox' },
                { name: "img_src", label: "Image URL", type: 'text' },
            ]);
        }
    }, [countriesSuccess, countriesData]);

    if (countriesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <GenericTable<Competition>
            title="Competitions"
            url="/api/v1/admin/competitions"
            itemName="Competition"
            columns={columns}
            enableEditing
            enableDeleting
            enableAdding

            fields={fields}
        />
    );
}
