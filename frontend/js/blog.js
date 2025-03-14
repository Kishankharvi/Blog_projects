import { showToast,showLoading, hideLoading, fetchAPI, API_BASE_URL, formatDate } from "./utils.js";

const pageContent = document.getElementById("page-content");

async function submitComment(blogId) {
  const commenterName = document.getElementById("commenter-name").value;
  const content = document.getElementById("comment-content").value;

  if (!commenterName || !content) {
    showToast("Please fill in all fields", "error");
    return;
  }

  showLoading();

  try {
    const commentData = {
      commenterName: commenterName,
      content: content,
      blogId: blogId,
    };

    console.log("Submitting comment:", commentData);

    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error submitting comment (${response.status}): ${errorText}`);
      
      if (response.status === 404) {
        showToast("Blog not found. It may have been deleted.", "error");
      } else if (response.status === 429) {
        showToast("Too many comments submitted. Please try again later.", "error");
      } else {
        showToast("Failed to submit comment. Please try again.", "error");
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await response.json();

    showToast("Comment submitted successfully!", "success");

    document.getElementById("commenter-name").value = "";
    document.getElementById("comment-content").value = "";

    renderBlogPage();
  } catch (error) {
    console.error("Error submitting comment:", error);
    if (!error.message.includes("HTTP error")) {
      showToast("Network error. Please check your connection.", "error");
    }
  } finally {
    hideLoading();
  }
}

async function deleteBlog(blogId) {
  if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
    return;
  }

  showLoading();
  console.log(showLoading)

  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error deleting blog (${response.status}): ${errorText}`);
      
      if (response.status === 404) {
        showToast("Blog not found. It may have been already deleted.", "error");
      } else if (response.status === 403) {
        showToast("You don't have permission to delete this blog post.", "error");
      } else {
        showToast("Failed to delete blog post. Please try again.", "error");
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    showToast("Blog post deleted successfully!", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    console.error("Error deleting blog:", error);
    if (!error.message.includes("HTTP error")) {
      showToast("Network error. Please check your connection.", "error");
    }
  } finally {
    hideLoading();
  }
}

async function renderBlogPage() {
  showLoading();


  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");

  if (!blogId) {
    pageContent.innerHTML = `
      <div class="container">
        <div class="alert-error">
          Blog ID is missing. Please go back to the <a href="index.html">home page</a>.
        </div>
      </div>
    `;
    hideLoading();
    return;
  }

  try {

    const blog = await fetchAPI(`${API_BASE_URL}/blogs/${blogId}`);

    document.title = `${blog.title} - Modern Blog`;

    const comments = await fetchAPI(`${API_BASE_URL}/comments/blog/${blogId}`);

    let commentsHTML = "";

    if (!comments || comments.length === 0) {
      commentsHTML = "<p>No comments yet. Be the first to comment!</p>";
    } else {
      comments.forEach((comment) => {
        commentsHTML += `
          <div class="comment-item">
            <div class="comment-header">
              <div class="commenter-name">${comment.commenterName}</div>
              <div class="comment-date">${formatDate(comment.createdAt)}</div>
            </div>
            <div class="comment-content">
              <p>${comment.content}</p>
            </div>
          </div>
        `;
      });
    }
    const imageSrc = `http://localhost:8080/uploads/images/${blog.imagePath}`;

    const imageErrorHandler = `onerror="this.src='https://via.placeholder.com/1200x600';this.onerror=null;"`;

    pageContent.innerHTML = `
      <div class="container">
        <div class="blog-single">
          <div class="blog-header">
            <h1 class="blog-single-title">${blog.title}</h1>
            <div class="blog-single-meta">
              <div class="blog-author">
                <i class="fas fa-user"></i> ${blog.author || "Anonymous"}
              </div>
              <div class="blog-date">
                <i class="far fa-calendar-alt"></i> ${formatDate(blog.createdAt)}
              </div>
              <div class="blog-actions">
                <a href="edit.html?id=${blogId}" class="btn btn-secondary">
                  <i class="fas fa-edit"></i> Edit
                </a>
                <button class="btn btn-danger" onclick="deleteBlog('${blogId}')">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
          <img src="${imageSrc}" alt="${blog.title}" class="blog-single-image" ${imageErrorHandler}>
          <div class="blog-single-content">
            ${blog.content}
          </div>
        </div>
        
        <div class="comments-section">
          <h2 class="comments-title">Comments (${comments ? comments.length : 0})</h2>
          ${commentsHTML}
        </div>
        
        <div class="comment-form">
          <h2 class="form-title">Leave a Comment</h2>
          <form id="comment-form">
            <div class="form-group">
              <label for="commenter-name" class="form-label">Your Name</label>
              <input type="text" id="commenter-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="comment-content" class="form-label">Your Comment</label>
              <textarea id="comment-content" class="form-control" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit Comment</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById("comment-form").addEventListener("submit", (e) => {
      e.preventDefault();
      submitComment(blogId);
    });
    
 
    window.deleteBlog = deleteBlog;
  } catch (error) {
    console.error("Error loading blog:", error);
    pageContent.innerHTML = `
      <div class="container">
        <div class="alert-error">
          Failed to load blog. Please try again later.
          <p>Error: ${error.message}</p>
          <a href="index.html" class="btn btn-primary">Return to Home</a>
        </div>
      </div>
    `;
  } finally {
    hideLoading();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderBlogPage();
});


export { submitComment, deleteBlog, renderBlogPage };