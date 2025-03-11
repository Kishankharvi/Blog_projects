import { showLoading, hideLoading, fetchAPI, API_BASE_URL } from "./utils.js";


const pageContent = document.getElementById("page-content")

// Search blogs
async function searchBlogs(query) {
  showLoading()

  try {
    // Fetch search results
    const blogs = await fetchAPI(`${API_BASE_URL}/blogs/search?query=${encodeURIComponent(query)}`)

    // Generate blog cards
    let blogCards = ""

    if (!blogs || blogs.length === 0) {
      blogCards = `<p class="text-center">No blogs found matching "${query}". Try a different search term.</p>`
    } else {
      blogs.forEach((blog) => {
        const imageSrc = blog.imagePath ;
        const excerpt = truncateText(blog.content, 150)

        blogCards += `
                    <div class="blog-card">
                        <img src="${imageSrc}" alt="${blog.title}" class="blog-image">
                        <div class="blog-content">
                            <div class="blog-meta">
                                <div class="blog-author">
                                    <i class="fas fa-user"></i> ${blog.author || "Anonymous"}
                                </div>
                                <div class="blog-date">
                                    <i class="far fa-calendar-alt"></i> ${formatDate(blog.createdAt)}
                                </div>
                            </div>
                            <h2 class="blog-title">${blog.title}</h2>
                            <p class="blog-excerpt">${excerpt}</p>
                            <a href="blog.html?id=${blog.id}" class="read-more">
                                Read more <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                `
      })
    }

   
    pageContent.innerHTML = `
            <div class="container">
                <h1 class="search-title">Search Results for "${query}"</h1>
                <div class="blog-grid">
                    ${blogCards}
                </div>
            </div>
        `
  } catch (error) {
    console.error("Error searching blogs:", error)
    pageContent.innerHTML = `
            <div class="container">
                <div class="alert-error">
                    Failed to search blogs. Please try again later.
                </div>
            </div>
        `
  } finally {
    hideLoading()
  }
}


document.addEventListener("DOMContentLoaded", () => {
 
  const urlParams = new URLSearchParams(window.location.search)
  const query = urlParams.get("q")

  if (query) {
   
    document.title = `Search: ${query} - Modern Blog`
    searchBlogs(query)
  } else {
    pageContent.innerHTML = `
            <div class="container">
                <div class="alert-error">
                    No search query provided. Please try searching again.
                </div>
            </div>
        `
  }
})

