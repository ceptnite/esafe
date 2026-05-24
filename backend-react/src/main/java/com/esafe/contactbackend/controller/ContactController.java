package com.esafe.contactbackend.controller;

import com.esafe.contactbackend.dto.ContactForm;
import com.esafe.contactbackend.service.EmailService;
import com.esafe.contactbackend.model.ContactMessage;
import com.esafe.contactbackend.repository.ContactRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/contact")
@Validated
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:3000", 
    "http://localhost:5500",
    "http://127.0.0.1:5173",
    "https://esafe-gamma.vercel.app"
})

public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    private final EmailService emailService;
    private final ContactRepository contactRepository;

    public ContactController(EmailService emailService, ContactRepository contactRepository) {
        this.emailService = emailService;
        this.contactRepository = contactRepository;
    }

    @PostMapping
    public ResponseEntity<?> submit(@Valid @RequestBody ContactForm form) {
        try {
            logger.info("Received contact form from: {}", form.getEmail());
            
            ContactMessage msg = new ContactMessage(form.getName(), form.getEmail(), form.getMessage());
            ContactMessage savedMsg = contactRepository.save(msg);
            
            logger.info("Message saved with ID: {}", savedMsg.getId());
            
            emailService.sendReply(form);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "success",
                "message", "Your message has been sent successfully",
                "id", savedMsg.getId()
            ));
            
        } catch (Exception e) {
            logger.error("Error processing contact form", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "An error occurred. Please try again later."
                ));
        }
    }

    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactRepository.findAll();
        logger.info("Retrieved {} messages from database", messages.size());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessage> getMessageById(@PathVariable Long id) {
        return contactRepository.findById(id)
            .map(message -> {
                logger.info("Retrieved message with ID: {}", id);
                return ResponseEntity.ok(message);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMessage(@PathVariable Long id, @Valid @RequestBody ContactForm form) {
        return contactRepository.findById(id)
            .map(existingMessage -> {
                logger.info("Updating message with ID: {}", id);
                
                existingMessage.setName(form.getName());
                existingMessage.setEmail(form.getEmail());
                existingMessage.setMessage(form.getMessage());
                
                ContactMessage updatedMessage = contactRepository.save(existingMessage);
                
                return ResponseEntity.ok(Map.of(
                    "status", "updated",
                    "message", "Message updated successfully",
                    "id", updatedMessage.getId()
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
            logger.info("Deleted message with ID: {}", id);
            return ResponseEntity.ok(Map.of(
                "status", "deleted",
                "message", "Message deleted successfully",
                "id", id
            ));
        } else {
            logger.warn("Attempted to delete non-existent message with ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(Map.of(
            "status", "error",
            "message", "Validation failed",
            "errors", errors
        ));
    }
}