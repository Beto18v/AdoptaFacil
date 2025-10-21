package com.example.demo.strategy;

import com.example.demo.dto.EmailRequest;
import jakarta.mail.internet.MimeMessage;

public interface EmailStrategy {
    void sendEmail(EmailRequest request, MimeMessage message) throws Exception;
}