export function showLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.style.display = "block";
  }
  
  export function hideLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.style.display = "none";
  }
  
  export const API_BASE_URL = "http://localhost:8080/api";
  
  export async function fetchAPI(endpoint, options = {}) {
    try {
      console.log(`Fetching: ${endpoint}`);
      const response = await fetch(endpoint, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      showToast("An error occurred while fetching data. Please try again.", "error");
      throw error;
    }
  }
  
  export function truncateText(text, maxLength) {
    if (!text) return "";
    const plainText = text.replace(/<[^>]*>?/gm, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substr(0, maxLength) + "...";
  }
  
  export function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
 
  export function showToast(message, type = "default", duration = 3000) {
    return new Promise(resolve => {
      const toast = document.getElementById("toast");
      if (!toast) {
        resolve(); 
        return;
      }
      
      toast.textContent = message;
      toast.className = "toast";
      
      if (type === "success") {
        toast.classList.add("toast-success");
      } else if (type === "error") {
        toast.classList.add("toast-error");
      }
     
      void toast.offsetWidth;
      
      toast.classList.add("show");
      
      setTimeout(() => {
        toast.classList.remove("show");
        
        setTimeout(() => {
          resolve();
        }, 300); 
      }, duration);
    });
  }
  