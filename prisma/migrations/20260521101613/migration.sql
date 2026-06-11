/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Friend` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idpeminta,idpenerima]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idpeminta` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idpenerima` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_senderId_fkey";

-- DropIndex
DROP INDEX "Friend_senderId_receiverId_key";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "idpeminta" INTEGER NOT NULL,
ADD COLUMN     "idpenerima" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_idpeminta_idpenerima_key" ON "Friend"("idpeminta", "idpenerima");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_idpeminta_fkey" FOREIGN KEY ("idpeminta") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_idpenerima_fkey" FOREIGN KEY ("idpenerima") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
