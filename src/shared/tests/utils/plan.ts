import { Plan } from 'src/plans/entities/plan.entity';

export default class PlanUtils {
  static giveMeAValidPlan(): Plan {
    const plan = new Plan();
    plan.name = 'Plano Teste 1.0';
    plan.qtd_products = 100;
    plan.id = '1';
    return plan;
  }
}
