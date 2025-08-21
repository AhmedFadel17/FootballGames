type Competition = {
    id: number;
    name: string;
    short_name?: string;
    country_id?: number;
    type?: string;
    founded_year?: number;
    tier?: number;
    img_src?: string;
    popularity?: number;
    is_active: boolean;
    country?: Country;
}

