-- CreateTable
CREATE TABLE "Whitelist" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_email_key" ON "Whitelist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Whitelist_phone_key" ON "Whitelist"("phone");
