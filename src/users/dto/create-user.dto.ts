import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: 'Email utilizado para registro do usuário - deve ser único.',
    example: 'brunopassos@teddy.com.br'
  })
  email: string;

  @ApiProperty({
    description: 'Senha utilizado para registro do usuário - Deve conter pelo menos 6 caracteres.',
    example: '123456'
  })
  password: string;
}
