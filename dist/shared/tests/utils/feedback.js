"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedback_entity_1 = require("../../../feedback/feedback.entity");
class FeedbackUtils {
    static giveMeAValidFeedback(id = '1') {
        const feedback = new feedback_entity_1.Feedback();
        feedback.id = id;
        return feedback;
    }
    static giveMeAValidCreateFeedbackDto(orderId = '1', productId = '1', star = 5, comment = 'Interessante') {
        return { orderId, productId, star, comment };
    }
}
exports.default = FeedbackUtils;
//# sourceMappingURL=feedback.js.map