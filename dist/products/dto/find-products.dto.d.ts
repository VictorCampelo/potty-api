export declare class FindProductsDto {
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
    take?: number;
    page?: number;
}
