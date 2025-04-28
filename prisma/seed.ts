import { PrismaClient } from "@prisma/client"
import { initialCandidates } from "../lib/data"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Seed candidates
  console.log("Seeding candidates...")
  for (const candidate of initialCandidates) {
    await prisma.candidate.upsert({
      where: { id: candidate.id },
      update: {
        name: candidate.name,
        category: candidate.category,
        votes: candidate.votes,
        photo: candidate.photo,
        biography: candidate.biography,
      },
      create: {
        id: candidate.id,
        name: candidate.name,
        category: candidate.category,
        votes: candidate.votes,
        photo: candidate.photo,
        biography: candidate.biography,
      },
    })
  }
  console.log("Candidates seeded successfully!")

  // Seed admin user
  console.log("Seeding admin user...")
  const hashedPassword = await bcrypt.hash("v0t!ngsys@2025", 10)
  await prisma.user.upsert({
    where: { email: "agamirashadrack7@gmail.com" },
    update: {
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
    },
    create: {
      email: "agamirashadrack7@gmail.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
    },
  })
  console.log("Admin user seeded successfully!")

  // Seed settings
  console.log("Seeding settings...")
  await prisma.settings.upsert({
    where: { key: "votingEnabled" },
    update: { value: "true" },
    create: { key: "votingEnabled", value: "true" },
  })
  console.log("Settings seeded successfully!")

  console.log("Database seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
