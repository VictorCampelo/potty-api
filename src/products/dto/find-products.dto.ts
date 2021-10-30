export class FindProductsDto {
  limit?: number;
  offset?: number;
  loadRelations?: boolean;
  loadLastSolds?: boolean;
  files?: boolean;
  store?: boolean;
  order?: boolean;
  feedbacks?: boolean;
  feedbacksUser?: boolean;
  starsMax?: number;
  starsMin?: number;
  starsEq?: number;
  starsNeq?: number;
}
