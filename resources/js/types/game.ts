export type GameType = {
    id: number;
    slug:string,
    name: string;
    description: string;
    games?: Game[]
}
export type Game= {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
    game_type_id: number;
}