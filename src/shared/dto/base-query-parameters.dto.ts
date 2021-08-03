export abstract class BaseQueryParametersDto {
  sort: string; //informações a respeito de como os dados devem ser ordenados ao serem buscados no banco de dados
  page: number; //suporte à paginação
  limit: number; //Quantidade de dados a serem retornados por página
}
