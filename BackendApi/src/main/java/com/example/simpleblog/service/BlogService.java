package com.example.simpleblog.service;

import com.example.simpleblog.model.Blog;
import com.example.simpleblog.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private static final String UPLOAD_DIR = "uploads/images/";

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public Blog getBlogById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
    }

    public Blog createBlog(Blog blog, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            blog.setImagePath(imagePath);
        }
        return blogRepository.save(blog);
    }

    public Blog updateBlog(Long id, Blog blogDetails, MultipartFile image) {
        Blog blog = getBlogById(id);
        
        blog.setTitle(blogDetails.getTitle());
        blog.setContent(blogDetails.getContent());
        
        if (blogDetails.getAuthor() != null) {
            blog.setAuthor(blogDetails.getAuthor());
        }
        
        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            if (blog.getImagePath() != null) {
                deleteImage(blog.getImagePath());
            }
            String imagePath = saveImage(image);
            blog.setImagePath(imagePath);
        }
        
        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id) {
        Blog blog = getBlogById(id);
        
        // Delete image if exists
        if (blog.getImagePath() != null) {
            deleteImage(blog.getImagePath());
        }
        
        blogRepository.delete(blog);
    }

    public List<Blog> searchBlogs(String query) {
        return blogRepository.searchBlogs(query);
    }


    public String saveImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return null;
        }
    
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath); // Ensure directory exists
            }
    
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image file", e);
        }
    }
    
    private void deleteImage(String imagePath) {
        try {
            Path path = Paths.get(imagePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
  
            System.err.println("Failed to delete image: " + e.getMessage());
        }
    }
}

