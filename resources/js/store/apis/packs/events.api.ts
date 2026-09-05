import { mainApi, API_URL } from './../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, LookupOption } from '@/types';
import { Event } from '@/types';

const BASE_URL = `${API_URL}/events`;

export interface CreateEventRequest {
    name: string;
    slug: string;
    description?: string;
    img_src?: string;
    is_active: boolean;
    starts_at?: string;
    ends_at?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> { }

export interface EventFilter extends PaginationFilter {
    searchQuery?: string;
    is_active?: boolean;
}

export const eventsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query<ApiResponse<PaginationResponse<Event>>, EventFilter>({
            query: (filter) => {
                const params = new URLSearchParams();

                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params.append(key, value.toString());
                    }
                });

                return {
                    url: BASE_URL,
                    params: params,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({ type: 'Event' as const, id })),
                        { type: 'Event', id: 'LIST' },
                    ]
                    : [{ type: 'Event', id: 'LIST' }],
        }),

        getEventsLookup: builder.query<ApiResponse<LookupOption[]>, { query: string; limit?: number }>({
            query: ({ query, limit = 10 }) => ({
                url: `${API_URL}/lookups/events`,
                params: { query, limit },
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Event' as const, id })),
                        { type: 'Event', id: 'LOOKUP' },
                    ]
                    : [{ type: 'Event', id: 'LOOKUP' }],
        }),

        getEventById: builder.query<ApiResponse<Event>, number>({
            query: (id) => `${BASE_URL}/${id}`,
            providesTags: (_result, _err, id) => [{ type: 'Event', id }],
        }),

        createEvent: builder.mutation<ApiResponse<Event>, CreateEventRequest>({
            query: (body) => ({ url: BASE_URL, method: 'POST', body }),
            invalidatesTags: [{ type: 'Event', id: 'LIST' }],
        }),

        updateEvent: builder.mutation<ApiResponse<Event>, { id: number; body: UpdateEventRequest }>({
            query: ({ id, body }) => ({ url: `${BASE_URL}/${id}`, method: 'PUT', body }),
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Event', id },
                { type: 'Event', id: 'LIST' },
            ],
        }),

        deleteEvent: builder.mutation<ApiResponse<null>, number>({
            query: (id) => ({ url: `${BASE_URL}/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Event', id },
                { type: 'Event', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useGetEventsLookupQuery,
} = eventsApi;