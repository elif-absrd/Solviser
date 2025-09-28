-- CreateTable
CREATE TABLE "public"."legal_service_provider_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "firmName" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "taluka" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "email" TEXT,
    "website" TEXT,
    "registrationDate" TIMESTAMP(3),
    "companyAge" INTEGER,
    "annualTurnover" TEXT,
    "serviceCategories" TEXT[],
    "otherCategory" TEXT,
    "aadhaarLast4" TEXT,
    "pan" TEXT,
    "gstin" TEXT,
    "accountHolderName" TEXT,
    "accountNumber" TEXT,
    "bankName" TEXT,
    "ifscCode" TEXT,
    "branchName" TEXT,
    "upiId" TEXT,
    "paymentMode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_service_provider_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."legal_service_offerings" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "billingCycle" TEXT NOT NULL,

    CONSTRAINT "legal_service_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "legal_service_provider_profiles_user_id_key" ON "public"."legal_service_provider_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "public"."legal_service_provider_profiles" ADD CONSTRAINT "legal_service_provider_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."legal_service_offerings" ADD CONSTRAINT "legal_service_offerings_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."legal_service_provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
