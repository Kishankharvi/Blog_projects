
export function showLoading() {
    const loader = document.getElementById("loading-indicator")
    if (loader) loader.style.display = "block"
}

export function hideLoading() {
    const loader = document.getElementById("loading-indicator")
    if (loader) loader.style.display = "none"
}


export const API_BASE_URL = "http://localhost:8080/api";

export async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, options)
        if (!response.ok) {
            throw new Error("API request failed")
        }
        return await response.json()
    } catch (error) {
        console.error("API Error:", error)
        return null
    }
}


export function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
}

export function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
}
