// RedixModal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Input, { InputProps } from "../form/input/InputField";
import Select, { Option, SelectProps } from "../form/Select";

export type RedixModalInputProps= InputProps & {
  options?: Option[]
}

interface AddItemDialogProps<T> {
  title: string;
  isOpen: boolean;
  fields: RedixModalInputProps[];
  onAdd: (data: T) => Promise<void> | void;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<NonNullable<AddItemDialogProps<any>["size"]>, string> = {
  sm: "sm:w-[300px]",
  md: "sm:w-[400px]",
  lg: "sm:w-[600px]",
  xl: "sm:w-[800px]",
};

export default function RedixModal<T>({
  title,
  fields,
  onAdd,
  isOpen,
  onClose,
  size = "md",
}: AddItemDialogProps<T>) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  // prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(formData as T);
    setFormData({});
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[12]" />

        <Dialog.Content
          className={`
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
            bg-primary rounded-lg shadow-lg focus:outline-none z-[12]  w-[90%]
            ${sizeClasses[size]}
          `}
        >
          {/* Header with title and close button */}
          <div className="flex justify-between items-center text-secondary rounded-t-lg p-3 px-4">
            <Dialog.Title className="text-lg font-semibold uppercase">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="p-1 rounded bg-white text-red-500 hover:bg-secondary"
              >
                <IoCloseSharp size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white px-10 py-6 rounded-b-lg">
            {fields.map((field, index) => {
              const { type, options } = field;
              return (
                <div key={index}>
                  <label className="block text-sm font-medium mb-1">{field.label}</label>
                  {type == "select"
                    ?
                    <Select  options={options || []} onChange={(value) => handleChange(field.name || '', value)} />
                    :
                    <Input {...field} onChange={(e) => handleChange(field.name || '', e.target.value)} />
                  }
                </div>)
            }
            )}

            <div className="flex justify-center gap-2 mt-6">
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-accent bg-opacity-90 text-primary border border-primary hover:bg-opacity-100 min-w-[100px]"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-primary bg-opacity-90 text-secondary hover:bg-opacity-100 min-w-[100px]"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
