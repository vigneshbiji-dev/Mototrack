const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const isValidEmail = (email: string) => {
  if (!email?.trim()) return false
  return EMAIL_REGEX.test(email.trim())
}

export const getEmailError = (email: string) => {
  if (!email.trim()) return 'Email is required'
  if (!isValidEmail(email)) return 'Enter a valid email address (e.g. you@gmail.com)'
  return null
}
