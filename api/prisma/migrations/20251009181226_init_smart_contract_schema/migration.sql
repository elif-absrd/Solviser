-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "owner_id" TEXT,
    "razorpay_customer_id" TEXT,
    CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price_inr" INTEGER NOT NULL,
    "razorpay_plan_id" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "razorpay_subscription_id" TEXT,
    "razorpay_payment_id" TEXT,
    "status" TEXT NOT NULL,
    "current_period_start" DATETIME NOT NULL,
    "current_period_end" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_system_role" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action_name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    PRIMARY KEY ("user_id", "role_id"),
    CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "legal_service_provider_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "firmName" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "taluka" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "email" TEXT,
    "website" TEXT,
    "registrationDate" DATETIME,
    "companyAge" INTEGER,
    "annualTurnover" TEXT,
    "serviceCategories" TEXT,
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
    "agreed_to_terms_at" DATETIME,
    "e_sign_status" TEXT,
    "e_sign_transaction_id" TEXT,
    "e_signed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "legal_service_provider_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "legal_service_offerings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profile_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "billingCycle" TEXT NOT NULL,
    CONSTRAINT "legal_service_offerings_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "legal_service_provider_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_number" TEXT,
    "contract_title" TEXT NOT NULL,
    "contract_title_hindi" TEXT,
    "contract_type" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'ENGLISH',
    "description" TEXT,
    "description_hindi" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "builder_status" TEXT NOT NULL DEFAULT 'DRAFT',
    "current_step" INTEGER NOT NULL DEFAULT 1,
    "organization_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "assigned_to_id" TEXT,
    "buyer_name" TEXT NOT NULL,
    "buyer_gst_number" TEXT,
    "buyer_email" TEXT,
    "buyer_registered_address" TEXT,
    "buyer_contact_person" TEXT,
    "buyer_phone" TEXT,
    "supplier_name" TEXT,
    "supplier_email" TEXT,
    "supplier_phone" TEXT,
    "contract_value" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "advance_payment" REAL DEFAULT 0,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "renewal_date" DATETIME,
    "is_import_contract" BOOLEAN NOT NULL DEFAULT false,
    "shared_contract_id" TEXT,
    "firm_name" TEXT,
    "gst_state" TEXT,
    "total_amount" REAL,
    "amount_in_words" TEXT,
    "shipping_terms" TEXT,
    "payment_terms" TEXT,
    "payment_period" TEXT,
    "payment_period_from" TEXT,
    "invoice_date" DATETIME,
    "negotiation_date" DATETIME,
    "latest_shipment_date" DATETIME,
    "acceptance_date" DATETIME,
    "bl_date" DATETIME,
    "lc_expiry_date" DATETIME,
    "lc_expiry_place" TEXT,
    "presentation_deadline" DATETIME,
    "advising_bank_name" TEXT,
    "advising_bank_city" TEXT,
    "advising_bank_pin" TEXT,
    "advising_bank_country" TEXT,
    "has_commercial_invoice" BOOLEAN NOT NULL DEFAULT false,
    "has_packing_list" BOOLEAN NOT NULL DEFAULT false,
    "has_bill_of_landing" BOOLEAN NOT NULL DEFAULT false,
    "has_certificate_of_origin" BOOLEAN NOT NULL DEFAULT false,
    "has_insurance_certificate" BOOLEAN NOT NULL DEFAULT false,
    "has_phytosanitary_certificate" BOOLEAN NOT NULL DEFAULT false,
    "general_terms" TEXT,
    "general_terms_hindi" TEXT,
    "terms_and_clauses" TEXT,
    "terms_and_clauses_hindi" TEXT,
    "dispute_resolution_terms" TEXT,
    "agreement_checkbox" BOOLEAN NOT NULL DEFAULT false,
    "penalty_clause" TEXT,
    "governing_law" TEXT DEFAULT 'Indian Contract Act, 1872',
    "jurisdiction" TEXT DEFAULT 'India',
    "confidentiality_clause" BOOLEAN NOT NULL DEFAULT false,
    "force_majeure" BOOLEAN NOT NULL DEFAULT false,
    "risk_score" INTEGER NOT NULL DEFAULT 50,
    "risk_factors" TEXT,
    "industry" TEXT NOT NULL DEFAULT 'General',
    "risk_level" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "tags" TEXT,
    "template_id" TEXT,
    "document_path" TEXT,
    "signed_document_path" TEXT,
    "is_signed" BOOLEAN NOT NULL DEFAULT false,
    "signed_date" DATETIME,
    "notice_period_days" INTEGER DEFAULT 30,
    "last_review_date" DATETIME,
    "next_review_date" DATETIME,
    "last_modified_by_id" TEXT,
    "notes" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contracts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contracts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contracts_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "contracts_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "contract_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_dropdown_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "contract_dropdown_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" INTEGER,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contract_dropdown_options_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "contract_dropdown_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contract_dropdown_options_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "contract_dropdown_options" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'ENGLISH',
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionHindi" TEXT,
    "isStandard" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rating" REAL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "generalTerms" TEXT,
    "generalTermsHindi" TEXT,
    "shippingTerms" TEXT,
    "shippingTermsHindi" TEXT,
    "paymentTerms" TEXT,
    "paymentTermsHindi" TEXT,
    "deliveryTerms" TEXT,
    "deliveryTermsHindi" TEXT,
    "createdById" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pre_vetted_clauses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleHindi" TEXT,
    "content" TEXT NOT NULL,
    "contentHindi" TEXT,
    "language" TEXT NOT NULL DEFAULT 'ENGLISH',
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER,
    "template_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pre_vetted_clauses_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "contract_templates" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_name_hindi" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit" TEXT,
    "unit_price" REAL NOT NULL,
    "total_price" REAL NOT NULL,
    "description" TEXT,
    "description_hindi" TEXT,
    "hs_code" TEXT,
    "category" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_items_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_clauses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_hindi" TEXT,
    "content" TEXT NOT NULL,
    "content_hindi" TEXT,
    "clause_type" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_custom" BOOLEAN NOT NULL DEFAULT true,
    "pre_vetted_clause_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_clauses_pre_vetted_clause_id_fkey" FOREIGN KEY ("pre_vetted_clause_id") REFERENCES "pre_vetted_clauses" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "contract_clauses_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_custom_fields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "field_name_hindi" TEXT,
    "field_type" TEXT NOT NULL DEFAULT 'text',
    "field_value" TEXT NOT NULL,
    "field_options" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_custom_fields_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "document_name" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_by_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by_id" TEXT,
    "verified_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_documents_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contract_documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contract_documents_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_authorizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "authorization_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "authorized_at" DATETIME,
    "due_date" DATETIME,
    "reminder_sent" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_authorizations_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contract_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_risk_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "assessment_type" TEXT NOT NULL,
    "overall_risk_score" INTEGER NOT NULL,
    "risk_level" TEXT NOT NULL,
    "risk_factors" TEXT NOT NULL,
    "financial_risk" INTEGER NOT NULL DEFAULT 50,
    "operational_risk" INTEGER NOT NULL DEFAULT 50,
    "legal_risk" INTEGER NOT NULL DEFAULT 50,
    "reputational_risk" INTEGER NOT NULL DEFAULT 50,
    "recommendations" TEXT,
    "assessed_by_id" TEXT,
    "assessed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_risk_assessments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contract_risk_assessments_assessed_by_id_fkey" FOREIGN KEY ("assessed_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_milestones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "deliverables" TEXT,
    "payment_amount" REAL,
    "completed_at" DATETIME,
    "completed_by_id" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_milestones_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contract_milestones_completed_by_id_fkey" FOREIGN KEY ("completed_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_renewals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "renewal_type" TEXT NOT NULL,
    "renewal_terms" TEXT,
    "new_start_date" DATETIME NOT NULL,
    "new_end_date" DATETIME NOT NULL,
    "new_contract_value" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requested_by_id" TEXT NOT NULL,
    "approved_by_id" TEXT,
    "requested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" DATETIME,
    "notification_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_renewals_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contract_renewals_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contract_renewals_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "buyer_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "buyer_email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "notification_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "sent_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "buyer_notifications_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contract_disputes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contract_id" TEXT NOT NULL,
    "reported_by_id" TEXT,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolved_at" DATETIME,
    "resolved_by_id" TEXT,
    "escalation_level" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contract_disputes_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_owner_id_key" ON "organizations"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_razorpay_customer_id_key" ON "organizations"("razorpay_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_razorpay_plan_id_key" ON "subscription_plans"("razorpay_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_organization_id_key" ON "subscriptions"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_razorpay_subscription_id_key" ON "subscriptions"("razorpay_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_organization_id_name_key" ON "roles"("organization_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_name_key" ON "permissions"("action_name");

-- CreateIndex
CREATE UNIQUE INDEX "legal_service_provider_profiles_user_id_key" ON "legal_service_provider_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_number_key" ON "contracts"("contract_number");

-- CreateIndex
CREATE UNIQUE INDEX "contract_dropdown_categories_name_key" ON "contract_dropdown_categories"("name");
