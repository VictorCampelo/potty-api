interface Options {
  limit: number;
  offset: number;
  loadRelations?: boolean;
  loadLastSolds?: boolean;
}

interface Relations {
  files: boolean;
  store: boolean;
  feedbacks: boolean;
  feedbacksUser: boolean;
}

export class FindProductsDto {
  options?: Options;
  relations?: Relations;
}
