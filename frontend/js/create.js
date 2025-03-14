
import { showToast, showLoading, hideLoading, fetchAPI, API_BASE_URL } from "./utils.js";

const pageContent = document.getElementById("page-content");

async function createBlog() {
  const title = document.getElementById("blog-title").value;
  const author = document.getElementById("blog-author").value;
  const content = document.getElementById("blog-content").value;
  const imageInput = document.getElementById("blog-image");

  if (!title || !content) {
    showToast("Please fill all required fields", "error");
    return;
  }

  showLoading();

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (author) {
      formData.append("author", author);
    }

    if (imageInput.files && imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    console.log("Sending data to API...");
    const response = await fetchAPI(`${API_BASE_URL}/blogs`, {
      method: "POST",
      body: formData,
    });
    
    if (!response) {
      throw new Error("Failed to create blog post");
    }

    // Clear form fields
    document.getElementById("blog-title").value = "";
    document.getElementById("blog-author").value = "";
    document.getElementById("blog-content").value = "";
    document.getElementById("image-preview").style.display = "none";
    
    // Hide loading
    hideLoading();
    
    // Critical fix: Use await to ensure the showToast promise completes
    // Set duration to 2000ms (2 seconds) as requested
    console.log("Showing success toast...");
    await showToast("Blog post created successfully!", "success", 2000);
    
    console.log("Toast displayed. Redirecting...");
    // Only redirect after the toast has been displayed for the full duration
    window.location.href = "index.html";
    
  } catch (error) {
    console.error("Error creating blog:", error);
    showToast(`Failed to create blog post: ${error.message}`, "error");
    hideLoading();
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
    `;

  const blogForm = document.getElementById("blog-form");
  const imageUploadArea = document.getElementById("image-upload-area");
  const imageInput = document.getElementById("blog-image");
  const imagePreview = document.getElementById("image-preview");

  imageUploadArea.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", () => {
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };

      reader.readAsDataURL(imageInput.files[0]);
    }
  });

  imageUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    imageUploadArea.classList.add("dragover");
    imageUploadArea.style.backgroundColor = "#f0f0f0";
  });

  imageUploadArea.addEventListener("dragleave", () => {
    imageUploadArea.classList.remove("dragover");
    imageUploadArea.style.backgroundColor = "#f9f9f9";
  });

  imageUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    imageUploadArea.classList.remove("dragover");
    imageUploadArea.style.backgroundColor = "#f9f9f9";

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      imageInput.files = e.dataTransfer.files;

      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };

      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  });

  blogForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createBlog();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCreateBlogPage();
});

export { createBlog, renderCreateBlogPage };