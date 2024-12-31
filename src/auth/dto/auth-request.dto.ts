import { ApiProperty } from "@nestjs/swagger";

export class AuthRequestDto {
  @ApiProperty({
    description: 'Email de registro do usuário.',
    example: 'brunopassos@teddy.com.br'
  })
  email: string;
  
  @ApiProperty({
    description: 'Senha de registro do usuário.',
    example: '123456'
  })
  password: string;
}
