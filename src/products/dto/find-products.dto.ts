export class FindProductsDto {
  limit?: number;
  offset?: number;
  loadRelations?: boolean;
  loadLastSolds?: boolean;
  loadLastCreated?: boolean;
  loadWithHighestPrice?: boolean;
  files?: boolean;
  categories?: boolean;
  store?: boolean;
  order?: boolean;
  feedbacks?: boolean;
  feedbacksUser?: boolean;
  starsMax?: number;
  starsMin?: number;
  starsEq?: number;
  starsNeq?: number;

  //pagination
  take?: number;
  page?: number;
}
