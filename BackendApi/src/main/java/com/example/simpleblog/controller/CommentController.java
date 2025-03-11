package com.example.simpleblog.controller;

import com.example.simpleblog.model.Comment;
import com.example.simpleblog.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/blog/{blogId}")
    public List<Comment> getCommentsByBlogId(@PathVariable Long blogId) {
        return commentService.getCommentsByBlogId(blogId);
    }

    @PostMapping
    public Comment createComment(@RequestBody Map<String, Object> payload) {
        Comment comment = new Comment();
        comment.setCommenterName((String) payload.get("commenterName"));
        comment.setContent((String) payload.get("content"));
        
        Long blogId = Long.valueOf(payload.get("blogId").toString());
        
        return commentService.createComment(comment, blogId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}

