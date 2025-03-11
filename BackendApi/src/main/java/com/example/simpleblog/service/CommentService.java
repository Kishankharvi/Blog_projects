package com.example.simpleblog.service;

import com.example.simpleblog.model.Blog;
import com.example.simpleblog.model.Comment;
import com.example.simpleblog.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BlogService blogService;

    public List<Comment> getCommentsByBlogId(Long blogId) {
        return commentRepository.findByBlogId(blogId);
    }

    public Comment createComment(Comment comment, Long blogId) {
        Blog blog = blogService.getBlogById(blogId);
        comment.setBlog(blog);
        return commentRepository.save(comment);
    }

    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));
    }

    public void deleteComment(Long id) {
        Comment comment = getCommentById(id);
        commentRepository.delete(comment);
    }
}

