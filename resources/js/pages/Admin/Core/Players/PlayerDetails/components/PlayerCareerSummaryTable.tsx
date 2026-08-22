import { PlayerCareerSummary } from "@/types";

interface PlayerCareerSummaryTableProps {
    summaries: PlayerCareerSummary[];
}

export default function PlayerCareerSummaryTable({ summaries }: PlayerCareerSummaryTableProps) {
    if (!summaries || summaries.length === 0) {
        return (
            <div className="glass-card rounded-2xl p-12 text-center border border-white/5 text-white/40">
                No career summary recorded for this player yet.
            </div>
        );
    }

    // Calculate career grand totals across all teams
    const careerTotals = summaries.reduce(
        (acc, curr) => ({
            appearances: acc.appearances + (curr.appearances ?? 0),
            goals: acc.goals + (curr.goals ?? 0),
            assists: acc.assists + (curr.assists ?? 0),
            yellow_cards: acc.yellow_cards + (curr.yellow_cards ?? 0),
            red_cards: acc.red_cards + (curr.red_cards ?? 0),
            minutes: acc.minutes + (curr.minutes ?? 0),
        }),
        { appearances: 0, goals: 0, assists: 0, yellow_cards: 0, red_cards: 0, minutes: 0 }
    );

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-white/5 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
                            <th className="py-4 px-6">Team</th>
                            <th className="py-4 px-3 text-center">Apps</th>
                            <th className="py-4 px-3 text-center text-emerald-400">Goals</th>
                            <th className="py-4 px-3 text-center text-accent-cyan">Assists</th>
                            <th className="py-4 px-3 text-center text-amber-300">YC</th>
                            <th className="py-4 px-3 text-center text-rose-400">RC</th>
                            <th className="py-4 px-3 text-center">Mins</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {summaries.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                                    {item.team?.img_src && (
                                        <img
                                            src={item.team.img_src}
                                            alt={item.team.name}
                                            className="w-6 h-6 object-contain shrink-0"
                                        />
                                    )}
                                    <span>{item.team?.name || "N/A"}</span>
                                </td>
                                <td className="py-4 px-3 text-center text-white/80">{item.appearances ?? 0}</td>
                                <td className="py-4 px-3 text-center font-bold text-emerald-400">{item.goals ?? 0}</td>
                                <td className="py-4 px-3 text-center font-bold text-accent-cyan">{item.assists ?? 0}</td>
                                <td className="py-4 px-3 text-center text-amber-300">{item.yellow_cards ?? 0}</td>
                                <td className="py-4 px-3 text-center text-rose-400">{item.red_cards ?? 0}</td>
                                <td className="py-4 px-3 text-center text-white/60 text-xs">{item.minutes ?? 0}'</td>
                            </tr>
                        ))}
                    </tbody>

                    {/* Overall Career Totals Footer */}
                    <tfoot>
                        <tr className="bg-white/10 font-bold border-t-2 border-white/10 text-white">
                            <td className="py-4 px-6 uppercase tracking-wider text-xs">Overall Total</td>
                            <td className="py-4 px-3 text-center">{careerTotals.appearances}</td>
                            <td className="py-4 px-3 text-center text-emerald-400">{careerTotals.goals}</td>
                            <td className="py-4 px-3 text-center text-accent-cyan">{careerTotals.assists}</td>
                            <td className="py-4 px-3 text-center text-amber-300">{careerTotals.yellow_cards}</td>
                            <td className="py-4 px-3 text-center text-rose-400">{careerTotals.red_cards}</td>
                            <td className="py-4 px-3 text-center text-white/80 text-xs">{careerTotals.minutes}'</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}