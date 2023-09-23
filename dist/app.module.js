"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dotenv = __importStar(require("dotenv"));
const app_controller_1 = require("./app.controller");
const auth_module_1 = require("./auth/auth.module");
const mailer_config_1 = require("./configs/mailer.config");
const typeorm_config_1 = require("./configs/typeorm.config");
const users_module_1 = require("./users/users.module");
const stores_module_1 = require("./stores/stores.module");
const products_module_1 = require("./products/products.module");
const emails_module_1 = require("./emails/emails.module");
const files_module_1 = require("./files/files.module");
const categories_module_1 = require("./categories/categories.module");
const orders_module_1 = require("./orders/orders.module");
const feedback_module_1 = require("./feedback/feedback.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const coupons_module_1 = require("./coupons/coupons.module");
const order_historics_module_1 = require("./order-historics/order-historics.module");
const plans_module_1 = require("./plans/plans.module");
const payments_module_1 = require("./payments/payments.module");
const google_strategy_1 = require("./auth/google.strategy");
const facebook_strategy_1 = require("./auth/facebook.strategy");
const buyerhistory_module_1 = require("./buyerhistory/buyerhistory.module");
const serve_static_1 = require("@nestjs/serve-static");
const path = __importStar(require("path"));
dotenv.config();
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.configService.getTypeOrmConfig()),
            mailer_1.MailerModule.forRoot(mailer_config_1.mailerConfig),
            emails_module_1.EmailsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            stores_module_1.StoresModule,
            products_module_1.ProductsModule,
            files_module_1.FilesModule,
            categories_module_1.CategoriesModule,
            orders_module_1.OrdersModule,
            feedback_module_1.FeedbackModule,
            dashboard_module_1.DashboardModule,
            coupons_module_1.CouponsModule,
            order_historics_module_1.OrderHistoricsModule,
            plans_module_1.PlansModule,
            payments_module_1.PaymentsModule,
            buyerhistory_module_1.BuyerhistoryModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path.resolve(__dirname, '..', 'public', 'uploads'),
                serveRoot: '/uploads',
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [google_strategy_1.GoogleStrategy, facebook_strategy_1.FacebookStrategy],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map