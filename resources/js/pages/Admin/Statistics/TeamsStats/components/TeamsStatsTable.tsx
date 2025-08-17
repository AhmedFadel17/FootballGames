import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";


const columns: EditableColumnDef<Continent>[] = [
  { accessorKey: "name", header: "Name", enableEditing: true, size: 3 },
  { accessorKey: "code", header: "Code", enableEditing: true, size: 1 },
];

const fields = [
  { name: "name", label: "Name" },
  { name: "code", label: "Code" },
]
export default function TeamsStatsTable() {
  return (

    <GenericTable<Continent>
      title="TeamsStats"
      url="/api/v1/admin/competition-team-stats"
      itemName="TeamsStat"
      columns={columns}
      enableEditing
      enableDeleting
      enableAdding
      fields={fields}
    />
  );
}
