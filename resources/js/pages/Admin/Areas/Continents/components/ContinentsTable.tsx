import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery, useUpdateByIdMutation, useDeleteByIdMutation } from "@/services/api";

const columns: EditableColumnDef<Continent>[] = [
  { accessorKey: "name", header: "Name", enableEditing: true,size:3 },
  { accessorKey: "code", header: "Code", enableEditing: true,size:1 },
];

export default function ContinentsTable() {
  return (
    <GenericTable<Continent>
      title="Continents"
      url="/api/v1/admin/continents"
      itemName="Continent"
      columns={columns}
      useGetHook={useGetDataQuery}
      useUpdateHook={useUpdateByIdMutation}
      useDeleteHook={useDeleteByIdMutation}
      enableEditing
      enableDeleting
    />
  );
}
