import { neon, neonConfig } from "@neondatabase/serverless"

// Configure neon to use WebSocket for better performance
neonConfig.fetchConnectionCache = true

// Create SQL client
const sql = neon(process.env.DATABASE_URL!)

// Export the raw SQL client for direct queries
export { sql }

// Helper function to execute SQL queries
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    return (await sql(query, params)) as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database query failed")
  }
}

// Helper functions for common database operations

// Candidates
export async function getCandidates() {
  const query = `
    SELECT * FROM candidates 
    ORDER BY name ASC
  `
  return executeQuery(query)
}

export async function getCandidateById(id: string) {
  const query = `
    SELECT * FROM candidates 
    WHERE id = $1
  `
  const results = await executeQuery(query, [id])
  return results[0] || null
}

export async function updateCandidateVotes(id: string, votes: number) {
  const query = `
    UPDATE candidates 
    SET votes = votes + $1 
    WHERE id = $2 
    RETURNING *
  `
  const results = await executeQuery(query, [votes, id])
  return results[0] || null
}

export async function updateCandidate(id: string, updates: any) {
  const keys = Object.keys(updates)
  const values = Object.values(updates)

  // Build the SET part of the query
  const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(", ")

  const query = `
    UPDATE candidates 
    SET ${setClause} 
    WHERE id = $1 
    RETURNING *
  `

  const results = await executeQuery(query, [id, ...values])
  return results[0] || null
}

export async function resetAllVotes() {
  const query = `
    UPDATE candidates 
    SET votes = 0 
    RETURNING *
  `
  return executeQuery(query)
}

// Payments
export async function createPayment(data: any) {
  const { reference, candidateId, votes, amount, status, paymentMethod, phoneNumber, firstName, lastName, metadata } =
    data

  const query = `
    INSERT INTO payments (
      reference, candidate_id, votes, amount, status, 
      payment_method, phone_number, first_name, last_name, metadata
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *
  `

  const results = await executeQuery(query, [
    reference,
    candidateId,
    votes,
    amount,
    status,
    paymentMethod,
    phoneNumber,
    firstName,
    lastName,
    metadata ? JSON.stringify(metadata) : null,
  ])

  return results[0] || null
}

export async function getPaymentByReference(reference: string) {
  const query = `
    SELECT * FROM payments 
    WHERE reference = $1
  `
  const results = await executeQuery(query, [reference])
  return results[0] || null
}

export async function updatePayment(id: string, updates: any) {
  const keys = Object.keys(updates)
  const values = Object.values(updates)

  // Build the SET part of the query
  const setClause = keys
    .map((key, index) => {
      // Convert camelCase to snake_case for database column names
      const columnName = key.replace(/([A-Z])/g, "_$1").toLowerCase()
      return `${columnName} = $${index + 2}`
    })
    .join(", ")

  const query = `
    UPDATE payments 
    SET ${setClause} 
    WHERE id = $1 
    RETURNING *
  `

  const results = await executeQuery(query, [id, ...values])
  return results[0] || null
}

export async function getAllPayments() {
  const query = `
    SELECT p.*, c.name as candidate_name 
    FROM payments p
    JOIN candidates c ON p.candidate_id = c.id
    ORDER BY p.created_at DESC
  `
  return executeQuery(query)
}

export async function getPendingPayments() {
  const query = `
    SELECT * FROM payments 
    WHERE status = 'pending' 
    ORDER BY created_at DESC
  `
  return executeQuery(query)
}

// Users and Authentication
export async function getUserByEmail(email: string) {
  const query = `
    SELECT * FROM users 
    WHERE email = $1
  `
  const results = await executeQuery(query, [email])
  return results[0] || null
}

export async function createUser(data: any) {
  const { email, password, name, role = "user" } = data

  const query = `
    INSERT INTO users (email, password, name, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `

  const results = await executeQuery(query, [email, password, name, role])
  return results[0] || null
}

export async function createSession(data: any) {
  const { userId, token, expiresAt } = data

  const query = `
    INSERT INTO sessions (user_id, token, expires_at) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `

  const results = await executeQuery(query, [userId, token, expiresAt])
  return results[0] || null
}

export async function getSessionByToken(token: string) {
  const query = `
    SELECT s.*, u.* 
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = $1
  `
  const results = await executeQuery(query, [token])
  return results[0] || null
}

export async function deleteSession(token: string) {
  const query = `
    DELETE FROM sessions 
    WHERE token = $1
  `
  return executeQuery(query, [token])
}

// Audit Logs
export async function createAuditLog(data: any) {
  const { action, userId, details, ipAddress, userAgent } = data

  const query = `
    INSERT INTO audit_logs (action, user_id, details, ip_address, user_agent) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *
  `

  const results = await executeQuery(query, [
    action,
    userId || null,
    details ? JSON.stringify(details) : null,
    ipAddress,
    userAgent,
  ])

  return results[0] || null
}

export async function getAuditLogs(limit = 100) {
  const query = `
    SELECT * FROM audit_logs 
    ORDER BY created_at DESC 
    LIMIT $1
  `
  return executeQuery(query, [limit])
}

// Settings
export async function getSetting(key: string) {
  const query = `
    SELECT * FROM settings 
    WHERE key = $1
  `
  const results = await executeQuery(query, [key])
  return results[0] || null
}

export async function getAllSettings() {
  const query = `
    SELECT * FROM settings
  `
  return executeQuery(query)
}

export async function upsertSetting(key: string, value: string) {
  const query = `
    INSERT INTO settings (key, value) 
    VALUES ($1, $2)
    ON CONFLICT (key) 
    DO UPDATE SET value = $2, updated_at = NOW()
    RETURNING *
  `

  const results = await executeQuery(query, [key, value])
  return results[0] || null
}
