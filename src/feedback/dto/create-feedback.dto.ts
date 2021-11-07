interface IFeedback {
  star: number;
  comment?: string;
  productId: string;
}
export class CreateFeedbackDto {
  feedbacks: IFeedback[];
}
