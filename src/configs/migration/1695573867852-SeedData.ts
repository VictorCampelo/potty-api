import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

const user1Id = '123e4567-e89b-12d3-a456-426614174001';
const user2Id = '123e4567-e89b-12d3-a456-426614174002';
const product1Id = '123e4567-e89b-12d3-a456-426614174101';
const product2Id = '123e4567-e89b-12d3-a456-426614174102';
const store1Id = '123e4567-e89b-12d3-a456-426614175001';
const store2Id = '123e4567-e89b-12d3-a456-426614175002';
const coupon1Id = '123e4567-e89b-12d3-a456-426614176001';
const coupon2Id = '123e4567-e89b-12d3-a456-426614176002';
const category1Id = '123e4567-e89b-12d3-a456-426614177001';
const category2Id = '123e4567-e89b-12d3-a456-426614177002';
const file1Id = '123e4567-e89b-12d3-a456-426614178001';
const file2Id = '123e4567-e89b-12d3-a456-426614178002';
const file3Id = '123e4567-e89b-12d3-a456-426614178003';
const file4Id = '123e4567-e89b-12d3-a456-426614178004';
const file5Id = '123e4567-e89b-12d3-a456-426614178005';
const file6Id = '123e4567-e89b-12d3-a456-426614178006';
const file7Id = '123e4567-e89b-12d3-a456-426614178007';
const file8Id = '123e4567-e89b-12d3-a456-426614178008';
const plan1Id = '123e4567-e89b-12d3-a456-426614179001';
const plan2Id = '123e4567-e89b-12d3-a456-426614179002';
const payment1Id = '123e4567-e89b-12d3-a456-426614189001';
const payment2Id = '123e4567-e89b-12d3-a456-426614189002';
const orderHistoric1Id = '123e4567-e89b-12d3-a456-426614199001';
const orderHistoric2Id = '123e4567-e89b-12d3-a456-426614199002';
const order1Id = '123e4567-e89b-12d3-a456-426614299001';
const order2Id = '123e4567-e89b-12d3-a456-426614299002';
const buyerhistory1Id = '123e4567-e89b-12d3-a456-426614399001';
const buyerhistory2Id = '123e4567-e89b-12d3-a456-426614399002';
const feedback1Id = '123e4567-e89b-12d3-a456-426615399001';
const feedback2Id = '123e4567-e89b-12d3-a456-426615399002';

export class SeedData1695573867852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert data for File
    await queryRunner.query(`
      INSERT INTO "file" (id, name, "filename", "alternativeText", "caption", "hash", "ext", "mime", "provider", "url", "previewUrl", "width", "height", "createdBy", "updatedBy", "formats", "providerMetadata")
      VALUES
      ('${file1Id}', 'file1', 'file1.jpg', 'Alternative Text 1', 'Caption 1', 'hash1', 'jpg', 'image/jpeg', 'provider1', 'https://example.com/file1.jpg', 'https://example.com/preview1.jpg', 800, 600, 1, 1, '{"small": "url1_small.jpg", "medium": "url1_medium.jpg", "large": "url1_large.jpg"}', '{"metadata1": "value1"}'),
      ('${file2Id}', 'file2', 'file2.jpg', 'Alternative Text 2', 'Caption 2', 'hash2', 'jpg', 'image/jpeg', 'provider2', 'https://example.com/file2.jpg', 'https://example.com/preview2.jpg', 1024, 768, 2, 2, '{"small": "url2_small.jpg", "medium": "url2_medium.jpg", "large": "url2_large.jpg"}', '{"metadata2": "value2"}'),
      ('${file3Id}', 'file3', 'file3.jpg', 'Alternative Text 2', 'Caption 2', 'hash3', 'jpg', 'image/jpeg', 'provider2', 'https://example.com/file3.jpg', 'https://example.com/preview2.jpg', 1024, 768, 2, 2, '{"small": "url2_small.jpg", "medium": "url2_medium.jpg", "large": "url2_large.jpg"}', '{"metadata2": "value2"}'),
      ('${file4Id}', 'file4', 'file4.jpg', 'Alternative Text 2', 'Caption 2', 'hash4', 'jpg', 'image/jpeg', 'provider2', 'https://example.com/file4.jpg', 'https://example.com/preview2.jpg', 1024, 768, 2, 2, '{"small": "url2_small.jpg", "medium": "url2_medium.jpg", "large": "url2_large.jpg"}', '{"metadata2": "value2"}'),
      ('${file5Id}', 'file5', 'file5.jpg', 'Alternative Text 2', 'Caption 2', 'hash5', 'jpg', 'image/jpeg', 'provider2', 'https://example.com/file5.jpg', 'https://example.com/preview2.jpg', 1024, 768, 2, 2, '{"small": "url2_small.jpg", "medium": "url2_medium.jpg", "large": "url2_large.jpg"}', '{"metadata2": "value2"}'),
      ('${file6Id}', 'file6', 'file6.jpg', 'Alternative Text 2', 'Caption 2', 'hash6', 'jpg', 'image/jpeg', 'provider2', 'https://example.com/file6.jpg', 'https://example.com/preview2.jpg', 1024, 768, 2, 2, '{"small": "url2_small.jpg", "medium": "url2_medium.jpg", "large": "url2_large.jpg"}', '{"metadata2": "value2"}'),
      ('${file7Id}', 'file7', 'file7.jpg', 'Alternative Text 2', 'Caption 2', 'hash7', 'jpg', 'image/jpeg', 'provider2', 'https://example.com/file7.jpg', 'https://example.com/preview2.jpg', 1024, 768, 2, 2, '{"small": "url2_small.jpg", "medium": "url2_medium.jpg", "large": "url2_large.jpg"}', '{"metadata2": "value2"}'),
      ('${file8Id}', 'file8', 'file8.jpg', 'Alternative Text 2', 'Caption 2', 'hash8', 'jpg', 'image/jpeg', 'provider2', 'https://example.com/file8.jpg', 'https://example.com/preview2.jpg', 1024, 768, 2, 2, '{"small": "url2_small.jpg", "medium": "url2_medium.jpg", "large": "url2_large.jpg"}', '{"metadata2": "value2"}');
    `);

    await queryRunner.query(`
      INSERT INTO "plan" ("id", "name", "nickname", "url", "code", "price", "qtd_products")
      VALUES
      ('${plan1Id}', 'Plan 1', 'N1', 'plan1.url', 1, 50, 10),
      ('${plan2Id}', 'Plan 2', 'N2', 'plan2.url', 2, 70, 20);
    `);

    // Generate stores
    await queryRunner.query(`
    INSERT INTO "store" ("id", "name", "formated_name", "CNPJ", "phone", "street", "zipcode", "addressNumber", "neighborhood", "city", "state", "description", "enabled", "sum_orders", "sum_feedbacks", "sum_stars", "avg_stars", "facebook_link", "instagram_link", "whatsapp_link", "schedules", "createdAt", "updatedAt", "likes", "deliveryFee", "dispatch", "avatarId", "backgroundId")
    VALUES
    ('${store1Id}', 'Store 1', 'store1', '123456789', '123456789', 'Main St', '123456', 101, 'Neighborhood1', 'City1', 'State1', 'Description for Store 1', true, 200, 100, 300, 4.7, 'facebook.com/store1', 'instagram.com/store1', 'whatsapp.com/store1', '{"seg":["06:00","20:00"],"ter":["06:00","20:00"],"qua":["06:00","20:00"],"qui":["06:00","20:00"],"sex":["06:00","20:00"],"sab":["07:00","12:00"],"dom":["07:00","12:00"]}', NOW(), NOW(), 500, 10, 'withdrawal', '${file3Id}', '${file4Id}'),
    ('${store2Id}', 'Store 2', 'store2', '987654321', '987654321', 'Elm St', '654321', 202, 'Neighborhood2', 'City2', 'State2', 'Description for Store 2', true, 300, 150, 400, 4.9, 'facebook.com/store2', 'instagram.com/store2', 'whatsapp.com/store2', '{"seg":["07:00","20:00"],"ter":["07:00","20:00"],"qua":["07:00","20:00"],"qui":["07:00","20:00"],"sex":["07:00","20:00"],"sab":["08:00","12:00"],"dom":["08:00","12:00"]}', NOW(), NOW(), 600, 15, 'delivery', '${file5Id}', '${file6Id}');
  `);

    // Generate a salt
  const salt1 = await bcrypt.genSalt();
  const salt2 = await bcrypt.genSalt();

  // Hash the password using the generated salt
  const hashedPassword1 = await bcrypt.hash('123456789', salt1);
  const hashedPassword2 = await bcrypt.hash('123456789', salt2);

  await queryRunner.query(`
  INSERT INTO "user" ("id", "email", "firstName", "lastName", "role", "enabled", "password", "salt", "confirmationToken", "confirmationTokenDigits", "recoverToken", "recoverTokenDigits", "hasAcceptedTerms", "createdAt", "updatedAt", "storeId", "zipcode", "street", "addressNumber", "neighborhood", "complement", "city", "uf", "logradouro", "plan_id", "googleId", "facebookId", "profileImageId")
  VALUES
    ('${user1Id}', 'user1@example.com', 'John', 'Doe', 'user', true, '${hashedPassword1}', '${salt1}', 'confirmationToken1', '123456', 'recoverToken1', '654321', true, NOW(), NOW(), '${store1Id}', '123456', 'Main St', 123, 'Neighborhood1', 'Apt 101', 'City1', 'State1', 'logradouro1', '${plan1Id}', 'googleId1', 'facebookId1', '${file1Id}'),
    ('${user2Id}', 'user2@example.com', 'Jane', 'Smith', 'user', true, '${hashedPassword2}', '${salt2}', 'confirmationToken2', '654321', 'recoverToken2', '123456', false, NOW(), NOW(), '${store2Id}', '654321', 'Elm St', 456, 'Neighborhood2', 'Apt 202', 'City2', 'State2', 'logradouro2', '${plan2Id}', 'googleId2', 'facebookId2', '${file2Id}');
`);

    await queryRunner.query(`
  INSERT INTO "product" ("id", "title", "description", "tags", "price", "priceWithDiscount", "discount", "sumOrders", "sumFeedbacks", "sumStars", "avgStars", "inventory", "lastSold", "parcelAmount", "createdAt", "updatedAt", "store_id")
  VALUES
  ('${product1Id}', 'Product 1', 'Description for Product 1', 'tag1,tag2', 100.0, 90.0, 10.0, 50, 20, 150, 4.5, 200, NOW(), 1, NOW(), NOW(), '${store1Id}'),
  ('${product2Id}', 'Product 2', 'Description for Product 2', 'tag3,tag4', 150.0, 130.0, 20.0, 70, 30, 180, 4.8, 300, NOW(), 2, NOW(), NOW(), '${store2Id}');
  `);

    // Insert data for Coupon
    await queryRunner.query(`
      INSERT INTO "coupon" ("id", "code", "type", "range", "discountPorcent", "discountValue", "maxUsage", "isExpired", "isPrivate", "isLimited", "validate", "createdAt", "updatedAt", "store_id")
      VALUES
      ('${coupon1Id}', 
      'CODE123', 
      'percentage', 
      'product', 
      10.0, 
      0, 
      100, 
      false, 
      false, 
      false, 
      NOW(),
      NOW(), 
      NOW(), 
      '${store1Id}'),
      ('${coupon2Id}', 'CODE456', 'fixed', 'category', 0, 50.0, 200, false, true, true,NOW(), NOW(), NOW(), '${store1Id}');
    `);

    // Insert data for Category
    await queryRunner.query(`
    INSERT INTO "category" (id, "name", "enabled", "type", "store_products_id", "createdAt", "updatedAt", "couponId")
    VALUES
    ('${category1Id}', 'Category 1', true, 'product', '${store1Id}', NOW(), NOW(), '${coupon1Id}'),
    ('${category2Id}', 'Category 2', true, 'product', '${store2Id}', NOW(), NOW(), '${coupon2Id}');
    `);

    await queryRunner.query(`
    INSERT INTO "products_categories" ("productId", "categoryId")
    VALUES
    ('${product1Id}', '${category1Id}'),
    ('${product2Id}', '${category2Id}');
    `);

    // Insert data for Store_Category
    await queryRunner.query(`
    INSERT INTO "store_category" ("storeId", "categoryId")
    VALUES
    ('${store1Id}', '${category1Id}'),
    ('${store2Id}', '${category2Id}');
    `);

    // Insert data for Favorites
    await queryRunner.query(`
    INSERT INTO "favorites" ("userId", "storeId")
    VALUES
    ('${user1Id}', '${store1Id}'),
    ('${user2Id}', '${store2Id}');
    `);

    await queryRunner.query(`
    INSERT INTO "order" ("id", "orderNumber", "user_id", "store_id", "amount", "status", "situation", "requiresDelivery", "customerAddress", "createdAt", "updatedAt", "couponId")
    VALUES
        ('${order1Id}', 'ORD123', '${user1Id}', '${store1Id}', 250.0, true, 'Received', true, '123 Main St, City1, State1', NOW(), NOW(), '${coupon1Id}'),
        ('${order2Id}', 'ORD456', '${user2Id}', '${store2Id}', 300.0, true, 'Received', false, '456 Elm St, City2, State2', NOW(), NOW(), '${coupon2Id}');
    `);

    // Insert data for Order Historic
    await queryRunner.query(`
        INSERT INTO "order_historic" ("id", "storeId", "productQtd", "paymentMethod", "productPrice", "productParcels", "customerId", "order_id", "product_id")
        VALUES
        ('${orderHistoric1Id}', '${store1Id}', 2, 'credit_card', 100.0, 3, '${user1Id}', '${order1Id}', '${product1Id}'),
        ('${orderHistoric2Id}', '${store2Id}', 1, 'paypal', 150.0, 2, '${user2Id}', '${order2Id}', '${product2Id}');
    `);

    await queryRunner.query(`
    INSERT INTO "buyerhistory" ("id", "accountStatus", "paymentMethod", "createdAt", "updatedAt", "userId")
    VALUES
    ('${buyerhistory1Id}', 'active', 'credit_card', NOW(), NOW(), '${user1Id}'),
    ('${buyerhistory2Id}', 'inactive', 'paypal', NOW(), NOW(), '${user2Id}');
    `);

    await queryRunner.query(`
    INSERT INTO "feedback" ("id", "orderId", "star", "comment", "createdAt", "updatedAt", "userId", "productId")
    VALUES
    ('${feedback1Id}', '${order1Id}', 4, 'Good service!', NOW(), NOW(), '${user1Id}', '${product1Id}'),
    ('${feedback2Id}', '${order2Id}', 5, 'Excellent product!', NOW(), NOW(), '${user2Id}', '${product2Id}');
    `);

    await queryRunner.query(`
    INSERT INTO "payment" ("id", "methodName", "allowParcels", "logoId")
    VALUES
    ('${payment1Id}', 'Credit Card', true, '${file7Id}'),
    ('${payment2Id}', 'PayPal', false, '${file8Id}');
    `);

    // Insert data for Store_Payment
    await queryRunner.query(`
    INSERT INTO "store_payment" ("storeId", "paymentId")
    VALUES
    ('${store1Id}', '${payment1Id}'),
    ('${store2Id}', '${payment2Id}');
    `);

    await queryRunner.query(`
    INSERT INTO "user_coupons_used" ("userId", "couponId")
    VALUES
    ('${user1Id}', '${coupon1Id}'),
    ('${user2Id}', '${coupon2Id}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM "user" WHERE id IN ('${user1Id}', '${user2Id}');
    `);
    await queryRunner.query(`
    DELETE FROM "file" WHERE id IN ('${file1Id}', '${file2Id}', '${file3Id}', '${file4Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "order_historic" WHERE id IN ('${orderHistoric1Id}', '${orderHistoric2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "product" WHERE id IN ('${product1Id}', '${product2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "coupon" WHERE id IN ('${coupon1Id}', '${coupon2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "category" WHERE id IN ('${category1Id}', '${category2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "payment" WHERE id IN ('${payment1Id}', '${payment2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "store" WHERE id IN ('${store1Id}', '${store2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "products_categories" WHERE "productId" IN ('${product1Id}', '${product2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "store_category" WHERE "storeId" IN ('${store1Id}', '${store2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "favorites" WHERE "userId" IN ('${user1Id}', '${user2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "store_payment" WHERE "storeId" IN ('${store1Id}', '${store2Id}');
    `);

    await queryRunner.query(`
    DELETE FROM "user_coupons_used" WHERE "userId" IN ('${user1Id}', '${user2Id}');
    `);
  }
}
