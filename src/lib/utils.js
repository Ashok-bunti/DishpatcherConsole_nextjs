
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Invalid Number"
    
    const cleaned = phoneNumber.replace(/\D/g, "")
    
    if (cleaned.length === 10) {
        return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    
    return "Invalid Number"
}

export const extractCustomerInfo = (customerContact) => {
    if (!customerContact) return { name: "", phone: "" }
    
    const lastParenIndex = customerContact.lastIndexOf("(")
    let customerName = customerContact
    let customerPhone = ""

    if (lastParenIndex !== -1) {
        customerName = customerContact.slice(0, lastParenIndex).trim()
        customerPhone = customerContact.slice(lastParenIndex + 1).trim()
    }

    return {
        name: customerName,
        phone: formatPhoneNumber(customerPhone)
    }
}

export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export const formatDate = (dateString, timezone = null) => {
    if (!dateString) return "-"

    const date = new Date(dateString)

    if (timezone) {
        return date.toLocaleString("en-US", {
            timeZone: timezone,
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}

export const calculateTimeSince = (dateString) => {
    if (!dateString) return null

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = Math.max(0, now.getTime() - date.getTime())

    if (diffMs <= 0) return 'Just now'

    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours % 24}h ago`
    } else if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes % 60}m ago`
    } else if (diffMinutes > 0) {
        return `${diffMinutes}m ago`
    } else if (diffSeconds > 30) {
        return `${diffSeconds}s ago`
    } else {
        return 'Just now'
    }
}

export const getInitials = (name) => {
    if (!name) return "-"
    
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
}

export const isShiftActive = (driver, timeData) => {
    if (!timeData || timeData.length === 0) return false

    try {
        const { DateTime } = require('luxon')
        const currentTime = DateTime.now().setZone(timeData[0].timeData.timeZoneId)

        const shiftStart = driver.shiftStart?.$date
            ? DateTime.fromISO(driver.shiftStart.$date)
            : DateTime.fromISO(driver.shiftStart)

        const shiftEnd = driver.shiftEnd?.$date
            ? DateTime.fromISO(driver.shiftEnd.$date)
            : DateTime.fromISO(driver.shiftEnd)

        if (!shiftStart.isValid || !shiftEnd.isValid) return false

        const shiftStartLocal = shiftStart.setZone(currentTime.zoneName)
        const shiftEndLocal = shiftEnd.setZone(currentTime.zoneName)

        return currentTime >= shiftStartLocal && currentTime <= shiftEndLocal
    } catch (e) {
        console.error("Error checking shift times:", e)
        return false
    }
}