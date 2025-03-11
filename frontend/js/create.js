
import {  showLoading, hideLoading, fetchAPI, API_BASE_URL } from "./utils.js";



const pageContent = document.getElementById("page-content") 


async function createBlog() {
  const title = document.getElementById("blog-title").value
  const author = document.getElementById("blog-author").value
  const content = document.getElementById("blog-content").value
  const imageInput = document.getElementById("blog-image")
  console.log(imageInput);

  console.log("1. Create blog function started")

  if (!title || !content) {
    showToast("Please fill all required fields", "error")
    return
  }

  showLoading()
  console.log("2. Loading shown")

  // Set a timeout to force hide the loading after 15 seconds
  const loadingTimeout = setTimeout(() => {
    console.log("TIMEOUT: Force hiding loading after 15 seconds")
    hideLoading()
    showToast("Request timed out. Check console for details.", "error")
  }, 15000)

  try {
    console.log("3. Preparing form data")
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)

    if (author) {
      formData.append("author", author)
    }
console.log(imageInput.files);
    if (imageInput.files && imageInput.files[0]) {
      formData.append("image", imageInput.files[0])
      console.log(`4. Image attached: ${imageInput.files[0].name}, size: ${imageInput.files[0].size} bytes`)
    } else {
      console.log("4. No image attached")
    }

    
    for (const pair of formData.entries()) {
      if (pair[0] === "content") {
        console.log(`FormData: ${pair[0]} = (content length: ${pair[1].length} chars)`)
      } else if (pair[0] === "image") {
        console.log(`FormData: ${pair[0]} = (file object)`)
      } else {
        console.log(`FormData: ${pair[0]} = ${pair[1]}`)
      }
    }

    // Basic connectivity test
    // try {
    //   const testResponse = await fetch(`${API_BASE_URL}/blogs`, { method: "HEAD" })
    //   console.log(`6a. API connectivity test: ${testResponse.ok ? "SUCCESS" : "FAILED"} (${testResponse.status})`)
    // } catch (testError) {
    //   console.error("6a. API connectivity test FAILED:", testError)
    //  throw new Error("API connectivity test failed")
    console.log("6b. Sending actual form data...")
    const response = await fetchAPI( `${API_BASE_URL}/blogs`, {
      method: "POST",
      body: formData,
    })  

    console.log(`7. Response received: status ${response.status}`)

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorBody = await response.text()
        console.error(`8. Error response body: ${errorBody}`)
        errorMessage += `, details: ${errorBody}`
      } catch (e) {
        console.error("8. Could not read error response body")
      }
      throw new Error(errorMessage)
    }

    console.log("9. Parsing response JSON")
    const newBlog = await response.json()
    console.log("10. Blog created successfully:", newBlog)

   
    clearTimeout(loadingTimeout)

    showToast("Blog post created successfully!", "success")
    hideLoading()

    console.log(`11. Redirecting to blog.html?id=${newBlog.id} in 1.5 seconds`)
    setTimeout(() => {
      window.location.href = `blog.html?id=${newBlog.id}`
    }, 1000000)
  } catch (error) {
    clearTimeout(loadingTimeout)

    console.error("ERROR in create blog:", error)
    showToast(`Failed to create blog post: ${error.message}`, "error")
    hideLoading()
  } finally {
    console.log("12. Create blog operation completed (finally block)")
  
    hideLoading()
  }
}

function renderCreateBlogPage() {
  pageContent.innerHTML = `
        <div class="container">
            <div class="blog-form">
                <h2 class="form-title">Create a New Blog Post</h2>
                <form id="blog-form">
                    <div class="form-group">
                        <label for="blog-title" class="form-label">Title</label>
                        <input type="text" id="blog-title" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="blog-author" class="form-label">Author</label>
                        <input type="text" id="blog-author" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="blog-content" class="form-label">Content</label>
                        <textarea id="blog-content" class="form-control" rows="10" required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Featured Image</label>
                        <div class="image-upload" id="image-upload-area">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span class="image-upload-text">Click to upload an image or drag and drop</span>
                            <input type="file" id="blog-image" accept="image/*" style="display: none;">
                        </div>
                        <img id="image-preview" class="image-preview" style="display: none;">
                    </div>
                    <button type="submit" class="btn btn-primary">Publish Blog Post</button>
                </form>
            </div>
        </div>
    `

  const blogForm = document.getElementById("blog-form")
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
    imageUploadArea.classList.add("dragover") // Better to use a class
    imageUploadArea.style.backgroundColor = "#f0f0f0"
  })

  imageUploadArea.addEventListener("dragleave", () => {
    imageUploadArea.classList.remove("dragover") // Better to use a class
    imageUploadArea.style.backgroundColor = "#f9f9f9"
  })

  imageUploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    imageUploadArea.classList.remove("dragover") // Better to use a class
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

  blogForm.addEventListener("submit", (e) => {
    e.preventDefault()
    createBlog()
  })
}

document.addEventListener("DOMContentLoaded", () => {
  renderCreateBlogPage()
})

export { createBlog, renderCreateBlogPage, API_BASE_URL }