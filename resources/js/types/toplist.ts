type TopListGame = {
    id: number;
    game_instance_id: number;
    title: string;
    items_type: string;
    size: number;
    max_chances: number;
    items?: TopListItem[];
    created_at: string;
    updated_at: string;
}


type TopListItem = {
    id: number;
    pos: number;
    object_id: number;
    object?: {
        id: number;
        name: string;
        img_src: string;
    };
    created_at: string;
    updated_at: string;
}

type TopListAnswer = {
    id: number;
    top_list_item_id: number;
    game_entry_id: number;
    created_at: string;
    updated_at: string;
}