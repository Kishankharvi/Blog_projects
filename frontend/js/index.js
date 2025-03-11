
import { showLoading, hideLoading , fetchAPI, API_BASE_URL ,truncateText, formatDate} from "./utils.js"

const pageContent = document.getElementById("page-content");

async function renderHomePage() {
  showLoading()

  try {
   
    const heroSection = `
            <section class="hero">
                <div class="container">
                    <h1>Welcome to Modern Blog</h1>
                    <p>Discover stories, thinking, and expertise from writers on any topic.</p>
                </div>
            </section>
        `

    const blogs = await fetchAPI(`${API_BASE_URL}/blogs`)
    console.log(blogs)

    let blogCards = ""

    if (!blogs || blogs.length === 0) {
      blogCards = '<p class="text-center">No blogs found. Be the first to create one!</p>'
    } else {
    
      blogs.forEach((blog) => {
        console.log(blog.imagePath);
        const imageSrc = `http://localhost:8080/${blog.imagePath}`;


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
console.log(pageContent);
  
    pageContent.innerHTML = `
            ${heroSection}
            <div class="container">
                <div class="blog-grid">
                    ${blogCards}
                </div>
            </div>
        `
  } catch (error) {
    console.error("Error loading blogs:", error)
    pageContent.innerHTML = `
            <div class="container">
                <div class="alert-error">
                    Failed to load blogs. Please try again later.
                </div>
            </div>
        `
  } finally {
    hideLoading()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHomePage()
})

