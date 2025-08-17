type Country = {
    id: number;
    name: string;
    code: string;
    img_src: string;
    popularity: number;
    continent_id?: number;
    continent?: {
        id: number;
        name: string;
        code: string;
    };
}

