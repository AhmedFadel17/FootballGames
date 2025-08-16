import { EditableColumnDef } from "@/types/table";
import GenericTable from "@/components/tables/GenericTable";
import { useGetDataQuery, useUpdateByIdMutation, useDeleteByIdMutation, useCreateDataMutation } from "@/services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const columns: EditableColumnDef<Continent>[] = [
  { accessorKey: "name", header: "Name", enableEditing: true, size: 3 },
  { accessorKey: "code", header: "Code", enableEditing: true, size: 1 },
];

export default function ContinentsTable() {
  const [createContinent] = useCreateDataMutation();

  const handleAddContinent = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Continent",
      html: `
        <input id="name" class="swal2-input" placeholder="Name">
        <input id="code" class="swal2-input" placeholder="Code">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("name") as HTMLInputElement).value.trim();
        const code = (document.getElementById("code") as HTMLInputElement).value.trim();

        if (!name || !code) {
          Swal.showValidationMessage("Both fields are required");
          return null;
        }

        return { name, code };
      }
    });

    if (formValues) {
      await toast.promise(
        createContinent({
          url: "/api/v1/admin/continents",
          body: formValues
        }).unwrap(),
        {
          loading: "Adding continent...",
          success: "Continent added successfully ✅",
          error: "Failed to add continent ❌"
        }
      );
    }
  };

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
      enableAdding
      onAdd={handleAddContinent}
    />
  );
}
