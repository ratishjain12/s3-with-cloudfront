-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "image_name" TEXT NOT NULL,
    "caption" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
