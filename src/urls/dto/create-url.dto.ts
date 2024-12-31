import { ApiProperty } from "@nestjs/swagger";

export class CreateUrlDto {
    @ApiProperty({
        description: 'URL que que o usuário vai encurtar.',
        example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/'
      })
    original_url: string
}