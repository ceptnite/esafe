package com.esafe.contactbackend.service;

import com.esafe.contactbackend.dto.ContactForm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendReply(ContactForm form) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, "UTF-8");
            helper.setTo(form.getEmail());
            helper.setFrom(fromAddress, "Esafe Team");
            helper.setSubject("Thanks for contacting Esafe");
            
            String body = buildBody(form);
            helper.setText(body, false);
            
            mailSender.send(msg);
            logger.info("Email sent successfully to: {}", form.getEmail());
        } catch (MessagingException | java.io.UnsupportedEncodingException ex) {
            logger.error("Failed to send email to: {}", form.getEmail(), ex);
        }
    }

    private String buildBody(ContactForm form) {
        StringBuilder sb = new StringBuilder();
        sb.append("Hi ").append(form.getName()).append(",\n\n");
        sb.append("Thanks for contacting Esafe. We received your message:\n\n");
        sb.append(form.getMessage()).append("\n\n");
        sb.append("We'll get back to you shortly.\n\n");
        sb.append("Esafe Team");
        return sb.toString();
    }
}