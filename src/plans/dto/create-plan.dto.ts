import { IsNotEmpty } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty({
    message: 'Insira o nome do plano',
  })
  name: string;

  qtd_products?: number;

  @IsNotEmpty({
    message: 'Insira um nome curto para o plano',
  })
  nickname: string;

  @IsNotEmpty({
    message: 'Insira a URL de referência na Eduzz',
  })
  url: string;

  @IsNotEmpty({
    message: 'Insira o código do produto',
  })
  code: number;
}
