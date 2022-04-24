"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStoreDto = void 0;
const openapi = require("@nestjs/swagger");
class UpdateStoreDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, formatedName: { required: false, type: () => String }, CNPJ: { required: true, type: () => String }, phone: { required: true, type: () => String }, addressNumber: { required: true, type: () => Number }, zipcode: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, description: { required: true, type: () => String }, facebookLink: { required: false, type: () => String }, instagramLink: { required: false, type: () => String }, whatsappLink: { required: false, type: () => String }, schedules: { required: true, type: () => Object }, deliveryFee: { required: false, type: () => Number }, categoriesIds: { required: false, type: () => [String] }, avatar: { required: false, type: () => Object }, background: { required: false, type: () => Object }, dispatch: { required: false, enum: require("../types/scheduleProperties.interface").DispatchTypes }, paymentMethods: { required: false, type: () => [String] } };
    }
}
exports.UpdateStoreDto = UpdateStoreDto;
//# sourceMappingURL=update-store.dto.js.map