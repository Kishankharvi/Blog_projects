package com.example.simpleblog.repository;

import com.example.simpleblog.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:query% OR b.content LIKE %:query% OR b.author LIKE %:query%")
    List<Blog> searchBlogs(@Param("query") String query);
}

