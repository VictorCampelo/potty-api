"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../../../users/user.entity");
class UserUtils {
    static giveMeAValidUser(id = '123') {
        const user = new user_entity_1.User();
        user.id = id;
        user.firstName = 'Rodrigo';
        user.lastName = 'Brito';
        user.neighborhood = 'Ininga';
        user.street = 'Rua Jornalista Helder Feitosa';
        user.addressNumber = 1131;
        user.city = 'Teresina';
        user.uf = 'PI';
        user.zipcode = '64049-905';
        return user;
    }
}
exports.default = UserUtils;
//# sourceMappingURL=user.js.map