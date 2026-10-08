const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  return EMAIL_REGEX.test(email.trim())
}

export const validateEmail = (email) => {
  const trimmed = email?.trim?.() ?? ''
  if (!trimmed) return { valid: false, message: 'Email is required' }
  if (!isValidEmail(trimmed)) {
    return { valid: false, message: 'Enter a valid email address (e.g. you@gmail.com)' }
  }
  return { valid: true, email: trimmed.toLowerCase() }
}
