"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plan_entity_1 = require("../../../plans/entities/plan.entity");
class PlanUtils {
    static giveMeAValidPlan() {
        const plan = new plan_entity_1.Plan();
        plan.name = 'Plano Teste 1.0';
        plan.qtd_products = 100;
        plan.id = '1';
        return plan;
    }
}
exports.default = PlanUtils;
//# sourceMappingURL=plan.js.map