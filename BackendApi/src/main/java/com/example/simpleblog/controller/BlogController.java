package com.example.simpleblog.controller;

import com.example.simpleblog.model.Blog;
import com.example.simpleblog.service.BlogService;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    public List<Blog> getAllBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/{id}")
    public Blog getBlogById(@PathVariable Long id) {
        return blogService.getBlogById(id);
    }

    @PostMapping
    public Blog createBlog(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setContent(content);
        blog.setAuthor(author);
        String imagePath = blogService.saveImage(image);
        blog.setImagePath(imagePath);
        return blogService.createBlog(blog, image);
    }

    @PutMapping("/{id}")
    public Blog updateBlog(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        Blog blog = new Blog();
        blog.setTitle(title);
        blog.setContent(content);
        blog.setAuthor(author);
        String imagePath = blogService.saveImage(image);
        blog.setImagePath(imagePath);
        return blogService.updateBlog(id, blog, image);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public List<Blog> searchBlogs(@RequestParam("query") String query) {
        return blogService.searchBlogs(query);
    }
  private final String UPLOAD_DIR = "uploads/images/";
  @GetMapping("/uploads/images/{filename:.+}")
  public ResponseEntity<Resource> getFile(@PathVariable String filename) {
      try {
          Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
          Resource resource = new UrlResource(filePath.toUri());
  
          if (!resource.exists() || !resource.isReadable()) {
              return ResponseEntity.notFound().build();
          }
  
          return ResponseEntity.ok()
                  .header("Content-Disposition", "inline; filename=\"" + resource.getFilename() + "\"")
                  .body(resource);
      } catch (Exception e) {
          return ResponseEntity.internalServerError().build();
      }
  }
  
}

