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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRepository = void 0;
const typeorm_1 = require("typeorm");
const store_entity_1 = require("./store.entity");
const _ = __importStar(require("lodash"));
let StoreRepository = class StoreRepository extends typeorm_1.Repository {
    constructor() {
        super();
    }
    async createStore(createStoreDto) {
        const createStore = _.omit(createStoreDto, 'files');
        return this.create(createStore);
    }
    async addLike(user, store) {
        const updatedStore = this.create();
        Object.assign(updatedStore, store);
        if (!updatedStore.usersWhoLiked) {
            updatedStore.usersWhoLiked = [user];
            updatedStore.likes++;
            await updatedStore.save();
            return updatedStore;
        }
        const previousUsers = updatedStore.usersWhoLiked;
        previousUsers.push(user);
        updatedStore.likes++;
        updatedStore.usersWhoLiked = previousUsers;
        await updatedStore.save();
        return updatedStore;
    }
};
StoreRepository = __decorate([
    (0, typeorm_1.EntityRepository)(store_entity_1.Store),
    __metadata("design:paramtypes", [])
], StoreRepository);
exports.StoreRepository = StoreRepository;
//# sourceMappingURL=stores.repository.js.map