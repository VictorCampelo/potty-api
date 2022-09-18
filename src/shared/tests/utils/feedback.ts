import { CreateFeedbackDto } from 'src/feedback/dto/create-feedback.dto';
import { Feedback } from 'src/feedback/feedback.entity';

export default class FeedbackUtils {
  static giveMeAValidFeedback(id = '1'): Feedback {
    const feedback = new Feedback();
    feedback.id = id;
    return feedback;
  }

  static giveMeAValidCreateFeedbackDto(
    orderId = '1',
    productId = '1',
    star = 5,
    comment = 'Interessante',
  ): CreateFeedbackDto {
    return { orderId, productId, star, comment };
  }
}
