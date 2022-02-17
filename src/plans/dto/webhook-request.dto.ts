interface TransactionItems {
  item_id: number;
  item_name: string;
  item_value: number; //float
  item_coupon_code?: string | number;
  item_product_id: number;
  item_product_name: string;
  item_product_refund: number;
  item_product_sku_reference?: string;
  item_product_partner_cod?: number;
  item_product_chargetype?: string;
}

export class WebhookRequestDto {
  origin: string;
  aff_cod: number;
  aff_document_number?: string;
  aff_email?: string;
  aff_name?: string;
  aff_value?: number; //float
  billet_url: string;
  cus_address: string;
  cus_address_city: string;
  cus_address_comp: string;
  cus_address_country: string;
  cus_address_district: string;
  cus_address_number: string;
  cus_address_state: string;
  cus_address_zip_code: string;
  cus_cel: string;
  cus_tel: string;
  cus_tel2: string;
  cus_cod: number;
  cus_email: string;
  cus_name: string;
  cus_taxnumber: string;
  eduzz_value: number; //float
  page_checkout_url: string;
  pro_document_number: string;
  pro_email: string;
  pro_name: string;
  pro_value?: number; //float
  other_values?: number; //float
  product_cod: number;
  product_name: string;
  product_refund: number;
  discount_coupon_code?: string;
  recurrence_cod?: number;
  recurrence_count?: number;
  recurrence_interval?: number;
  recurrence_interval_type?: string;
  recurrence_plan?: string;
  recurrence_startdate?: string;
  recurrence_status?: number;
  recurrence_status_name?: string;
  recurrence_type?: string;
  sku_reference: string;
  tracker_trk?: string;
  tracker_trk2?: string;
  tracker_trk3?: string;
  tracker_utm_campaign?: string;
  tracker_utm_content?: string;
  tracker_utm_medium?: string;
  tracker_utm_source?: string;
  trans_barcode?: string;
  trans_cod: number;
  trans_createdate: string;
  trans_createtime: string;
  trans_currency: string;
  trans_duedate: string;
  trans_duetime: string;
  trans_key: string;
  trans_orderid: number;
  trans_paid: number; //float
  trans_paiddate?: string;
  trans_paidtime?: string;
  trans_paymentmethod?: number;
  trans_status: number;
  trans_value?: number; //float
  trans_items: TransactionItems[];
  trans_items_quantity: number; //float
  trans_job_id?: number;
  trans_job_status?: number;
  api_key: string;
}
