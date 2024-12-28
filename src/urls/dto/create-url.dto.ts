export class CreateUrlDto {
    original_url: string
}

export class UrlDto {
    id: string
    original_url: string
    shortened_url_id: string
    click_cout: number
    created_at: string
    updated_at: string
    deleted_at: string | null
    user_id?: string | null
}
