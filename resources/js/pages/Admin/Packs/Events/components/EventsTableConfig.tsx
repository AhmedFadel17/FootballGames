import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Event } from "@/types";

export const getEventTableColumns = (): TableColumn<Event>[] => [
    {
        key: "name",
        header: "Event",
        align: "left",
        sortable: true,
        render: (event) => (
            <div className="flex items-center gap-2.5">
                <span
                    className="w-3 h-3 rounded-full border border-white/20 shrink-0 shadow-sm"
                    style={{ backgroundColor: event.theme_color || '#3b82f6' }}
                    title={event.theme_color || undefined}
                />
                <div>
                    <span className="font-semibold text-white/90">{event.name}</span>
                    <span className="block text-xs text-white/40 font-mono">{event.slug}</span>
                </div>
            </div>
        ),
        editRender: (event, onChange) => (
            <input
                type="text"
                value={event.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Event Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "theme_color",
        header: "Theme Color",
        align: "left",
        render: (event) => (
            <div className="flex items-center gap-2">
                <div
                    className="w-5 h-5 rounded border border-white/20"
                    style={{ backgroundColor: event.theme_color || '#3b82f6' }}
                />
                <span className="text-xs text-white/70 font-mono">{event.theme_color || '#3b82f6'}</span>
            </div>
        ),
        editRender: (event, onChange) => (
            <div className="flex items-center gap-1.5">
                <input
                    type="color"
                    value={event.theme_color || '#3b82f6'}
                    onChange={(e) => onChange({ theme_color: e.target.value })}
                    className="w-7 h-7 rounded border border-white/10 bg-transparent cursor-pointer"
                />
                <input
                    type="text"
                    value={event.theme_color || ''}
                    onChange={(e) => onChange({ theme_color: e.target.value })}
                    placeholder="#HEX"
                    className="w-20 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                />
            </div>
        ),
    },
    {
        key: "start_date",
        header: "Starts At",
        align: "left",
        sortable: true,
        render: (event) => {
            const dateStr = event.start_date || event.starts_at;
            return <span className="text-xs text-white/70">{dateStr ? new Date(dateStr).toLocaleDateString() : 'Permanent'}</span>;
        },
        editRender: (event, onChange) => (
            <input
                type="date"
                value={(event.start_date || event.starts_at)?.substring(0, 10) || ''}
                onChange={(e) => onChange({ start_date: e.target.value || null })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1 text-xs text-white focus:outline-none"
            />
        ),
    },
    {
        key: "end_date",
        header: "Ends At",
        align: "left",
        sortable: true,
        render: (event) => {
            const dateStr = event.end_date || event.ends_at;
            return <span className="text-xs text-white/70">{dateStr ? new Date(dateStr).toLocaleDateString() : 'No expiry'}</span>;
        },
        editRender: (event, onChange) => (
            <input
                type="date"
                value={(event.end_date || event.ends_at)?.substring(0, 10) || ''}
                onChange={(e) => onChange({ end_date: e.target.value || null })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1 text-xs text-white focus:outline-none"
            />
        ),
    },
    {
        key: "img_src",
        header: "Banner",
        align: "left",
        render: (event) => event.img_src ? (
            <img src={event.img_src} alt={event.name} className="w-12 h-7 object-cover rounded border border-white/10" />
        ) : (
            <span className="text-white/30 text-xs italic">No image</span>
        ),
        editRender: (event, onChange) => (
            <input
                type="text"
                value={event.img_src || ''}
                onChange={(e) => onChange({ img_src: e.target.value })}
                placeholder="Banner URL"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none"
            />
        ),
    },
    {
        key: "is_active",
        header: "Status",
        align: "left",
        render: (event) => event.is_active ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Inactive
            </span>
        ),
        editRender: (event, onChange) => (
            <input
                type="checkbox"
                checked={event.is_active || false}
                onChange={(e) => onChange({ is_active: e.target.checked })}
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500"
            />
        ),
    },
];

export const getEventTableActions = (
    onDelete: (event: Event) => void
): TableAction<Event>[] => [
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
