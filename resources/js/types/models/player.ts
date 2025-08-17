type Player = {
    id: number;
    name: string;
    fullname?: string;
    position: string;
    date_of_birth?: string;
    img_src?: string;
    popularity?: number;
    api_id?: number;
    country_id?: number;
    country?: {
        id: number;
        name: string;
        code: string;
        img_src: string;
    };
}

