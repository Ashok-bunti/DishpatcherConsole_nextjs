const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Function to get auth token
const getAuthToken = () => {
  // Try to get from localStorage first
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || localStorage.getItem('authToken')
  }
  return null
}

// Function to handle 401 errors
const handle401Error = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
    // Redirect to login page
    window.location.href = '/signin' // Change this to your login route
  }
}

export const apiClient = {
  async get(url, options = {}) {
    const token = getAuthToken()
    
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (response.status === 401) {
      handle401Error()
      throw new ApiError('Unauthorized', 401)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    return response.json()
  },

  async post(url, data, options = {}) {
    const token = getAuthToken()
    
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    })

    if (response.status === 401) {
      handle401Error()
      throw new ApiError('Unauthorized', 401)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    return response.json()
  },

  async put(url, data, options = {}) {
    const token = getAuthToken()
    
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    })

    if (response.status === 401) {
      handle401Error()
      throw new ApiError('Unauthorized', 401)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    return response.json()
  },

  async delete(url, options = {}) {
    const token = getAuthToken()
    
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (response.status === 401) {
      handle401Error()
      throw new ApiError('Unauthorized', 401)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    return response.json()
  },
}

// Optional: Export helper to set token
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

// Optional: Export helper to clear token
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
  }
}