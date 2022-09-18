import { Category } from 'src/categories/category.entity';

export default class CategoryUtils {
  static giveMeAValidCategory(id = '1', name = 'batata'): Category {
    const ctg = new Category();
    ctg.id = id;
    ctg.name = name;
    return ctg;
  }
}
