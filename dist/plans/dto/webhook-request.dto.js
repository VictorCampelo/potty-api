"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookRequestDto = void 0;
const openapi = require("@nestjs/swagger");
class WebhookRequestDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { origin: { required: true, type: () => String }, aff_cod: { required: true, type: () => Number }, aff_document_number: { required: false, type: () => String }, aff_email: { required: false, type: () => String }, aff_name: { required: false, type: () => String }, aff_value: { required: false, type: () => Number }, billet_url: { required: true, type: () => String }, cus_address: { required: true, type: () => String }, cus_address_city: { required: true, type: () => String }, cus_address_comp: { required: true, type: () => String }, cus_address_country: { required: true, type: () => String }, cus_address_district: { required: true, type: () => String }, cus_address_number: { required: true, type: () => String }, cus_address_state: { required: true, type: () => String }, cus_address_zip_code: { required: true, type: () => String }, cus_cel: { required: true, type: () => String }, cus_tel: { required: true, type: () => String }, cus_tel2: { required: true, type: () => String }, cus_cod: { required: true, type: () => Number }, cus_email: { required: true, type: () => String }, cus_name: { required: true, type: () => String }, cus_taxnumber: { required: true, type: () => String }, eduzz_value: { required: true, type: () => Number }, page_checkout_url: { required: true, type: () => String }, pro_document_number: { required: true, type: () => String }, pro_email: { required: true, type: () => String }, pro_name: { required: true, type: () => String }, pro_value: { required: false, type: () => Number }, other_values: { required: false, type: () => Number }, product_cod: { required: true, type: () => Number }, product_name: { required: true, type: () => String }, product_refund: { required: true, type: () => Number }, discount_coupon_code: { required: false, type: () => String }, recurrence_cod: { required: false, type: () => Number }, recurrence_count: { required: false, type: () => Number }, recurrence_interval: { required: false, type: () => Number }, recurrence_interval_type: { required: false, type: () => String }, recurrence_plan: { required: false, type: () => String }, recurrence_startdate: { required: false, type: () => String }, recurrence_status: { required: false, type: () => Number }, recurrence_status_name: { required: false, type: () => String }, recurrence_type: { required: false, type: () => String }, sku_reference: { required: true, type: () => String }, tracker_trk: { required: false, type: () => String }, tracker_trk2: { required: false, type: () => String }, tracker_trk3: { required: false, type: () => String }, tracker_utm_campaign: { required: false, type: () => String }, tracker_utm_content: { required: false, type: () => String }, tracker_utm_medium: { required: false, type: () => String }, tracker_utm_source: { required: false, type: () => String }, trans_barcode: { required: false, type: () => String }, trans_cod: { required: true, type: () => Number }, trans_createdate: { required: true, type: () => String }, trans_createtime: { required: true, type: () => String }, trans_currency: { required: true, type: () => String }, trans_duedate: { required: true, type: () => String }, trans_duetime: { required: true, type: () => String }, trans_key: { required: true, type: () => String }, trans_orderid: { required: true, type: () => Number }, trans_paid: { required: true, type: () => Number }, trans_paiddate: { required: false, type: () => String }, trans_paidtime: { required: false, type: () => String }, trans_paymentmethod: { required: false, type: () => Number }, trans_status: { required: true, type: () => Number }, trans_value: { required: false, type: () => Number }, trans_items: { required: true, type: () => [Object] }, trans_items_quantity: { required: true, type: () => Number }, trans_job_id: { required: false, type: () => Number }, trans_job_status: { required: false, type: () => Number }, api_key: { required: true, type: () => String } };
    }
}
exports.WebhookRequestDto = WebhookRequestDto;
//# sourceMappingURL=webhook-request.dto.js.map