import { pgTable, serial, varchar, decimal, timestamp, integer } from 'drizzle-orm/pg-core';

export const company = pgTable('company', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
});

export const branchOffice = pgTable('branch_office', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    externalId: varchar('external_id').notNull(),
    idCompany: integer('id_company').references(() => company.id),
});

export const productGroup = pgTable('product_group', {
    id: serial('id').primaryKey(),
    description: varchar('description').notNull(),
    image: varchar('image'),
    price: decimal('price').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    category: varchar('category').notNull(),
});

export const product = pgTable('product', {
    id: serial('id').primaryKey(),
    description: varchar('description').notNull(),
    image: varchar('image'),
    price: decimal('price').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    idBranchOffice: integer('id_branch_office').references(() => branchOffice.id),
    idProductGroup: integer('id_product_group').references(() => productGroup.id),
    externalId: varchar('external_id').notNull(),
});