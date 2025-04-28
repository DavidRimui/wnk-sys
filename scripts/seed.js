const { sql } = require("@neondatabase/serverless")
const bcrypt = require("bcryptjs")
const { initialCandidates } = require("../lib/data")

// Database URL from environment variable
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set")
  process.exit(1)
}

async function seed() {
  try {
    console.log("Connecting to database...")

    // Create tables if they don't exist
    console.log("Creating tables...")
    const schemaSQL = await readFile("./schema.sql")
    await sql(schemaSQL)

    // Seed candidates
    console.log("Seeding candidates...")
    for (const candidate of initialCandidates) {
      await sql`
        INSERT INTO candidates (id, name, category, votes, photo, biography)
        VALUES (${candidate.id}, ${candidate.name}, ${candidate.category}, ${candidate.votes}, ${candidate.photo}, ${candidate.biography})
        ON CONFLICT (id) 
        DO UPDATE SET 
          name = ${candidate.name},
          category = ${candidate.category},
          photo = ${candidate.photo},
          biography = ${candidate.biography}
      `
    }
    console.log("Candidates seeded successfully!")

    // Seed admin user
    console.log("Seeding admin user...")
    const hashedPassword = await bcrypt.hash("v0t!ngsys@2025", 10)
    await sql`
      INSERT INTO users (email, name, password, role)
      VALUES ('agamirashadrack7@gmail.com', 'Admin User', ${hashedPassword}, 'admin')
      ON CONFLICT (email) 
      DO UPDATE SET 
        name = 'Admin User',
        password = ${hashedPassword},
        role = 'admin'
    `
    console.log("Admin user seeded successfully!")

    // Seed settings
    console.log("Seeding settings...")
    await sql`
      INSERT INTO settings (key, value)
      VALUES ('votingEnabled', 'true')
      ON CONFLICT (key) 
      DO UPDATE SET value = 'true'
    `
    console.log("Settings seeded successfully!")

    console.log("Database seeding completed!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

async function readFile(path) {
  const fs = require("fs")
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

seed()
