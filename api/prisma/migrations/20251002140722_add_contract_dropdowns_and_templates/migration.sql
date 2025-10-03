-- CreateTable
CREATE TABLE "public"."contract_dropdown_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_dropdown_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_dropdown_options" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_dropdown_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "generalTerms" TEXT,
    "shippingTerms" TEXT,
    "paymentTerms" TEXT,
    "deliveryTerms" TEXT,
    "disputeTerms" TEXT,
    "otherTerms" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contract_dropdown_categories_name_key" ON "public"."contract_dropdown_categories"("name");

-- AddForeignKey
ALTER TABLE "public"."contract_dropdown_options" ADD CONSTRAINT "contract_dropdown_options_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."contract_dropdown_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_dropdown_options" ADD CONSTRAINT "contract_dropdown_options_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."contract_dropdown_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
