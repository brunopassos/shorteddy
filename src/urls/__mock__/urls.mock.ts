import { UrlEntity } from "../entities/url.entity";

export const mockUrlEntity: UrlEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    original_url: 'https://example.com',
    shortened_url_id: '123456',
    click_count: 0,
    created_at: new Date('2024-12-28T15:57:38.763Z'),
    updated_at: new Date('2024-12-28T15:57:38.763Z'),
    deleted_at: null,
    user_id: 'user123',
    domain: 'short.ly',
};