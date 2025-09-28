-- AlterTable
ALTER TABLE "public"."legal_service_provider_profiles" ADD COLUMN     "e_sign_status" TEXT,
ADD COLUMN     "e_sign_transaction_id" TEXT,
ADD COLUMN     "e_signed_at" TIMESTAMP(3);
