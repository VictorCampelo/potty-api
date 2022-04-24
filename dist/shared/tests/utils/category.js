"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_entity_1 = require("../../../categories/category.entity");
class CategoryUtils {
    static giveMeAValidCategory(id = '1', name = 'batata') {
        const ctg = new category_entity_1.Category();
        ctg.id = id;
        ctg.name = name;
        return ctg;
    }
}
exports.default = CategoryUtils;
//# sourceMappingURL=category.js.map