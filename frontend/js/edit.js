
import { showToast, showLoading, hideLoading, fetchAPI, API_BASE_URL } from "./utils.js"
const pageContent = document.getElementById("page-content")







// Mock fetchAPI function (replace with your actual implementation)
// async function fetchAPI(url) {
//   const response = await fetch(url)
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`)
//   }
//   return await response.json()
// }

// Update blog post
async function updateBlog(blogId) {
  const title = document.getElementById("blog-title").value
  const author = document.getElementById("blog-author").value
  const content = document.getElementById("blog-content").value
  const imageInput = document.getElementById("blog-image")

  if (!title || !content) {
    showToast("Please fill all required fields", "error")
    return
  }

  showLoading()

  try {
    console.log("Preparing form data for update")
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)

    if (author) {
      formData.append("author", author)
    }

    if (imageInput.files && imageInput.files[0]) {
      formData.append("image", imageInput.files[0])
      console.log(`Image attached for update: ${imageInput.files[0].name}`)
    }

    console.log(`Sending PUT request to: ${API_BASE_URL}/blogs/${blogId}`)

    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
      method: "PUT",
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error updating blog (${response.status}): ${errorText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const updatedBlog = await response.json()
    console.log("Blog updated successfully:", updatedBlog)

    showToast("Blog post updated successfully!", "success")

    setTimeout(() => {
      window.location.href = `blog.html?id=${updatedBlog.id}`
    }, 1000)
  } catch (error) {
    console.error("Error updating blog:", error)
    showToast("Failed to update blog post. Please try again.", "error")
  } finally {
    hideLoading()
  }
}

async function renderEditBlogPage() {
  showLoading()

 
  const urlParams = new URLSearchParams(window.location.search)
  const blogId = urlParams.get("id")

  if (!blogId) {
    pageContent.innerHTML = `
            <div class="container">
                <div class="alert-error">
                    Blog ID is missing. Please go back to the home page.
                </div>
            </div>
        `
    hideLoading()
    return
  }

  try {
    
    const blog = await fetchAPI(`${API_BASE_URL}/blogs/${blogId}`)

    document.title = `Edit: ${blog.title} - Modern Blog`

    pageContent.innerHTML = `
            <div class="container">
                <div class="blog-form">
                    <h2 class="form-title">Edit Blog Post</h2>
                    <form id="edit-blog-form">
                        <div class="form-group">
                            <label for="blog-title" class="form-label">Title</label>
                            <input type="text" id="blog-title" class="form-control" value="${blog.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="blog-author" class="form-label">Author</label>
                            <input type="text" id="blog-author" class="form-control" value="${blog.author || ""}">
                        </div>
                        <div class="form-group">
                            <label for="blog-content" class="form-label">Content</label>
                            <textarea id="blog-content" class="form-control" rows="10" required>${blog.content}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Featured Image</label>
                            ${
                              blog.imagePath
                                ? `<div class="image-preview-container">
                                    <img src="${blog.imagePath}" alt="Current blog image" class="image-preview" style="display: block;">
                                    <p class="form-text">Current image</p>
                                </div>`
                                : '<p class="form-text">No image currently set</p>'
                            }
                            <div class="image-upload" id="image-upload-area">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span class="image-upload-text">Click to update image or drag and drop</span>
                                <input type="file" id="blog-image" accept="image/*" style="display: none;">
                            </div>
                            <img id="image-preview" class="image-preview">
                            <p class="form-text">Leave empty to keep the current image.</p>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="window.location.href='blog.html?id=${blogId}'">Cancel</button>
                            <button type="submit" class="btn btn-primary">Update Blog</button>
                        </div>
                    </form>
                </div>
            </div>
        `

    const editBlogForm = document.getElementById("edit-blog-form")
    const imageUploadArea = document.getElementById("image-upload-area")
    const imageInput = document.getElementById("blog-image")
    const imagePreview = document.getElementById("image-preview")

    imageUploadArea.addEventListener("click", () => {
      imageInput.click()
    })

    imageInput.addEventListener("change", () => {
      if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          imagePreview.src = e.target.result
          imagePreview.style.display = "block"
        }

        reader.readAsDataURL(imageInput.files[0])
      }
    })

    imageUploadArea.addEventListener("dragover", (e) => {
      e.preventDefault()
      imageUploadArea.style.backgroundColor = "#f0f0f0"
    })

    imageUploadArea.addEventListener("dragleave", () => {
      imageUploadArea.style.backgroundColor = "#f9f9f9"
    })

    imageUploadArea.addEventListener("drop", (e) => {
      e.preventDefault()
      imageUploadArea.style.backgroundColor = "#f9f9f9"

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        imageInput.files = e.dataTransfer.files

        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.src = e.target.result
          imagePreview.style.display = "block"
        }

        reader.readAsDataURL(e.dataTransfer.files[0])
      }
    })

    editBlogForm.addEventListener("submit", (e) => {
      e.preventDefault()
      updateBlog(blogId)
    })
  } catch (error) {
    console.error("Error loading blog for editing:", error)
    pageContent.innerHTML = `
            <div class="container">
                <div class="alert-error">
                    Failed to load blog for editing. Please try again later.
                </div>
            </div>
        `
  } finally {
    hideLoading()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderEditBlogPage()
})

