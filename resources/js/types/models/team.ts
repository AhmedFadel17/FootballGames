type Team = {
    id: number;
    name: string;
    abbr: string;
    short_name: string;
    img_src: string;
    country_id: number;
    api_id?: number;
    country?: {
        id: number;
        name: string;
        code: string;
        img_src: string;
    };
}

