import axios from 'axios'

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    if (error.response?.status === 401) return 'Invalid email or password'
    if (error.response?.status === 400) return 'Invalid request — check your details'
    if (error.response?.status === 502) {
      return 'Backend is not running — check your terminal for MongoDB connection errors'
    }
    if (!error.response) return 'Cannot reach server — is the backend running on port 5000?'
  }

  if (error instanceof Error && error.message) return error.message

  return fallback
}
