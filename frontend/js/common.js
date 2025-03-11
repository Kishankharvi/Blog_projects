const API_BASE_URL = "http://localhost:8080/api/blogs"

const pageContent = document.querySelector(".page-content")
const loading = document.querySelector(".loading")
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navLinks = document.querySelector(".nav-links")
const toast = document.getElementById("toast")


mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active")
})

function showLoading() {
  loading.style.display = "flex"
}

function hideLoading() {
  loading.style.display = "none"
}

function showToast(message, type = "default") {
  toast.textContent = message
  toast.className = "toast"

  if (type === "success") {
    toast.classList.add("toast-success")
  } else if (type === "error") {
    toast.classList.add("toast-error")
  }

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function truncateText(text, maxLength) {
  if (!text) return ""
  const plainText = text.replace(/<[^>]*>?/gm, "")
  if (plainText.length <= maxLength) return plainText
  return plainText.substr(0, maxLength) + "..."
}

async function fetchAPI(url, options = {}) {
  try {
    console.log(`Fetching: ${url}`)
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error (${response.status}): ${errorText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    showToast("An error occurred while fetching data. Please try again.", "error")
    throw error
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-form")

  if (searchForm) {
  
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const query = this.querySelector(".search-input").value.trim()

      if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`
      }
    })
  }
})

