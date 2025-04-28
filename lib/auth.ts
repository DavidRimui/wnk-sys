import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import * as bcrypt from "bcryptjs"
import { getUserByEmail, createSession, getSessionByToken, deleteSession, createAuditLog } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development-only"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export type AuthUser = {
  id: string
  email: string
  name: string | null
  role: string
}

export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await getUserByEmail(email)

    if (!user) return null

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return null

    // Create a session
    const token = generateToken(user)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await createSession({
      userId: user.id,
      token,
      expiresAt,
    })

    // Set the session cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    // Log the login
    await createAuditLog({
      action: "LOGIN",
      userId: user.id,
      details: { email: user.email },
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return null
  }
}

export async function signOut() {
  try {
    const token = cookies().get("auth_token")?.value
    if (token) {
      // Delete the session
      await deleteSession(token)
    }

    // Clear the cookie
    cookies().delete("auth_token")
    return true
  } catch (error) {
    console.error("Sign out error:", error)
    return false
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const token = cookies().get("auth_token")?.value
    if (!token) return null

    // Find the session
    const session = await getSessionByToken(token)

    if (!session) return null
    if (new Date() > new Date(session.expires_at)) {
      // Session expired
      await deleteSession(token)
      cookies().delete("auth_token")
      return null
    }

    return {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}

function generateToken(user: any): string {
  return sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  )
}

export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
