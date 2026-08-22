import React, { useState, useMemo } from "react";
import { PlayerSeasonStat } from "@/types";

interface PlayerStatsTableProps {
    stats: PlayerSeasonStat[];
}

export default function PlayerStatsTable({ stats }: PlayerStatsTableProps) {
    // Track expanded groups using a composite key: "seasonId_teamId"
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (groupKey: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupKey]: !prev[groupKey],
        }));
    };

    // Group stats by Season AND Team
    const groupedStats = useMemo(() => {
        const groups: Record<
            string,
            {
                seasonName: string;
                teamName: string;
                detailItems: PlayerSeasonStat[];
                summaryItem?: PlayerSeasonStat;
                totals: {
                    appearances: number;
                    goals: number;
                    assists: number;
                    yellow_cards: number;
                    red_cards: number;
                    minutes: number;
                };
            }
        > = {};

        stats.forEach((st) => {
            const seasonId = st.season_id ?? st.season?.id ?? 0;
            const teamId = st.team_id ?? st.team?.id ?? 0;
            const seasonName = st.season?.name || `Season #${seasonId}`;
            const teamName = st.team?.name || "N/A";

            // Composite key so mid-season transfers get separate rows
            const groupKey = `${seasonId}_${teamId}`;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    seasonName,
                    teamName,
                    detailItems: [],
                    totals: {
                        appearances: 0,
                        goals: 0,
                        assists: 0,
                        yellow_cards: 0,
                        red_cards: 0,
                        minutes: 0,
                    },
                };
            }

            // Separate parent summary row (isDetail === false) from competition rows (isDetail === true)
            if (st.is_detail === false) {
                groups[groupKey].summaryItem = st;
            } else {
                groups[groupKey].detailItems.push(st);
            }
        });

        // Compute or assign totals for each Season/Team spell
        Object.values(groups).forEach((group) => {
            if (group.summaryItem) {
                group.totals = {
                    appearances: group.summaryItem.appearances ?? 0,
                    goals: group.summaryItem.goals ?? 0,
                    assists: group.summaryItem.assists ?? 0,
                    yellow_cards: group.summaryItem.yellow_cards ?? 0,
                    red_cards: group.summaryItem.red_cards ?? 0,
                    minutes: group.summaryItem.minutes ?? 0,
                };
            } else {
                group.detailItems.forEach((st) => {
                    group.totals.appearances += st.appearances ?? 0;
                    group.totals.goals += st.goals ?? 0;
                    group.totals.assists += st.assists ?? 0;
                    group.totals.yellow_cards += st.yellow_cards ?? 0;
                    group.totals.red_cards += st.red_cards ?? 0;
                    group.totals.minutes += st.minutes ?? 0;
                });
            }
        });

        return groups;
    }, [stats]);

    if (!stats || stats.length === 0) {
        return (
            <div className="glass-card rounded-2xl p-12 text-center border border-white/5 text-white/40">
                No season stats recorded for this player yet.
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-white/5 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
                            <th className="py-4 px-6">Season</th>
                            <th className="py-4 px-6">Team</th>
                            <th className="py-4 px-6">Competition</th>
                            <th className="py-4 px-3 text-center">Apps</th>
                            <th className="py-4 px-3 text-center text-emerald-400">Goals</th>
                            <th className="py-4 px-3 text-center text-accent-cyan">Assists</th>
                            <th className="py-4 px-3 text-center text-amber-300">YC</th>
                            <th className="py-4 px-3 text-center text-rose-400">RC</th>
                            <th className="py-4 px-3 text-center">Mins</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {Object.entries(groupedStats).map(([groupKey, group]) => {
                            const isExpanded = !!expandedGroups[groupKey];
                            const hasDetails = group.detailItems.length > 0;

                            return (
                                <React.Fragment key={groupKey}>
                                    {/* Main Row: Specific Team Spell within a Season */}
                                    <tr
                                        onClick={() => hasDetails && toggleGroup(groupKey)}
                                        className={`hover:bg-white/10 bg-white/[0.02] transition-colors font-semibold ${hasDetails ? "cursor-pointer" : "cursor-default"
                                            }`}
                                    >
                                        <td className="py-4 px-6 text-white flex items-center gap-2">
                                            {hasDetails ? (
                                                <span
                                                    className={`material-symbols-outlined text-sm text-accent-cyan transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                                                        }`}
                                                >
                                                    chevron_right
                                                </span>
                                            ) : (
                                                <span className="w-4" />
                                            )}
                                            {group.seasonName}
                                        </td>
                                        <td className="py-4 px-6 text-white font-medium">
                                            {group.teamName}
                                        </td>
                                        <td className="py-4 px-6 text-white/60 text-xs italic">
                                            {group.detailItems.length > 0
                                                ? `${group.detailItems.length} Competitions`
                                                : group.summaryItem?.competition?.name || "All Competitions"}
                                        </td>
                                        <td className="py-4 px-3 text-center text-white">{group.totals.appearances}</td>
                                        <td className="py-4 px-3 text-center font-bold text-emerald-400">{group.totals.goals}</td>
                                        <td className="py-4 px-3 text-center font-bold text-accent-cyan">{group.totals.assists}</td>
                                        <td className="py-4 px-3 text-center text-amber-300">{group.totals.yellow_cards}</td>
                                        <td className="py-4 px-3 text-center text-rose-400">{group.totals.red_cards}</td>
                                        <td className="py-4 px-3 text-center text-white/80 text-xs">{group.totals.minutes}'</td>
                                    </tr>

                                    {/* Sub-Rows: Competition breakdown for this specific team spell */}
                                    {isExpanded &&
                                        group.detailItems.map((st) => (
                                            <tr key={st.id} className="bg-black/20 hover:bg-white/5 transition-colors text-xs border-t border-white/5">
                                                <td className="py-3 px-6 pl-12 text-white/40">↳</td>
                                                <td className="py-3 px-6 text-white/50 text-[11px]">
                                                    {st.team?.name || group.teamName}
                                                </td>
                                                <td className="py-3 px-6 text-white/90 font-medium">{st.competition?.name || "N/A"}</td>
                                                <td className="py-3 px-3 text-center text-white/70">{st.appearances ?? 0}</td>
                                                <td className="py-3 px-3 text-center font-medium text-emerald-400/90">{st.goals ?? 0}</td>
                                                <td className="py-3 px-3 text-center font-medium text-accent-cyan/90">{st.assists ?? 0}</td>
                                                <td className="py-3 px-3 text-center text-amber-300/80">{st.yellow_cards ?? 0}</td>
                                                <td className="py-3 px-3 text-center text-rose-400/80">{st.red_cards ?? 0}</td>
                                                <td className="py-3 px-3 text-center text-white/50">{st.minutes ?? 0}'</td>
                                            </tr>
                                        ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}