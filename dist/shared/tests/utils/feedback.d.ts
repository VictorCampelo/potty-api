import { CreateFeedbackDto } from "src/feedback/dto/create-feedback.dto";
import { Feedback } from "src/feedback/feedback.entity";
export default class FeedbackUtils {
    static giveMeAValidFeedback(id?: string): Feedback;
    static giveMeAValidCreateFeedbackDto(orderId?: string, productId?: string, star?: number, comment?: string): CreateFeedbackDto;
}
