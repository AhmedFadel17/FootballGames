import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Country } from "@/types";

export const getCountryTableColumns = (): TableColumn<Country>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (country) => <span className="font-medium text-white/80">{country.name}</span>,
        editRender: (country, onChange) => (
            <input
                type="text"
                value={country.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Country Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "code",
        header: "Code",
        align: "left",
        sortable: true,
        render: (country) => <span className="font-medium text-white/80">{country.code}</span>,
        editRender: (country, onChange) => (
            <input
                type="text"
                value={country.code || ''}
                onChange={(e) => onChange({ code: e.target.value })}
                placeholder="Country Code"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "img_src",
        header: "Flag",
        align: "left",
        render: (country) => <img src={country.img_src} alt="" className="w-10 h-8" />,

    },
    {
        key: "popularity",
        header: "Popularity",
        align: "center",
        sortable: true,
        render: (country) => country.popularity,
        editRender: (country, onChange) => (
            <input
                type="number"
                value={country.popularity || ''}
                onChange={(e) => onChange({ popularity: parseInt(e.target.value) })}
                placeholder="Country Popularity"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },

];

export const getCountryTableActions = (
    onDelete: (country: Country) => void
): TableAction<Country>[] => [
        {
            label: "Edit",
            icon: "edit",
            isEditAction: true,
            className: "text-primary-600 dark:text-primary-300",
        },
        {
            label: "Delete",
            icon: "delete",
            onClick: onDelete,
            className: "text-red-500",
        },
    ];