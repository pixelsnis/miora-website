import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto"
import { normalizeEmail, validateEmail } from "./survey"

const TOKEN_VERSION = "v1"
const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60
const IV_LENGTH = 12

type ResumePayload = {
  email: string
  expiresAt: number
}

function getKey() {
  const secret = process.env.SURVEY_RESUME_SECRET
  if (!secret) throw new Error("Survey resume secret is not configured")
  return createHash("sha256").update(secret).digest()
}

function encode(value: Buffer) {
  return value.toString("base64url")
}

function decode(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("Invalid token encoding")
  return Buffer.from(value, "base64url")
}

export function createSurveyResumeToken(email: string) {
  const normalizedEmail = normalizeEmail(email)
  if (!validateEmail(normalizedEmail)) throw new Error("Cannot create a resume token for an invalid email")

  const payload: ResumePayload = {
    email: normalizedEmail,
    expiresAt: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  }
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv)
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ])

  return [TOKEN_VERSION, encode(iv), encode(cipher.getAuthTag()), encode(ciphertext)].join(".")
}

export function readSurveyResumeToken(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) return null

  const parts = value.split(".")
  if (parts.length !== 4 || parts[0] !== TOKEN_VERSION) return null

  try {
    const iv = decode(parts[1])
    const authTag = decode(parts[2])
    const ciphertext = decode(parts[3])
    if (iv.length !== IV_LENGTH || authTag.length !== 16 || ciphertext.length === 0) return null

    const decipher = createDecipheriv("aes-256-gcm", getKey(), iv)
    decipher.setAuthTag(authTag)
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8")
    const payload = JSON.parse(plaintext) as Partial<ResumePayload>
    const email = normalizeEmail(payload.email)
    const expiresAt = payload.expiresAt

    if (
      typeof expiresAt !== "number" ||
      !Number.isInteger(expiresAt) ||
      expiresAt <= Math.floor(Date.now() / 1000) ||
      !validateEmail(email)
    ) {
      return null
    }

    return email
  } catch {
    return null
  }
}
