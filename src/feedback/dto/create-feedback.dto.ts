interface IFeedback {
  star: number;
  comment?: string;
  productId: string;
  orderId: string;
}
export class CreateFeedbackDto {
  // feedbacks: IFeedback[];
  star: number;
  comment?: string;
  productId: string;
  orderId: string;
}
