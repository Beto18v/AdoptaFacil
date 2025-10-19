package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String mailUsername;

    @Autowired
    public EmailService(JavaMailSender mailSender, @Value("${MAIL_USERNAME}") String mailUsername) {
        this.mailSender = mailSender;
        this.mailUsername = mailUsername;
    }

    public void sendWelcomeEmail(WelcomeEmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailUsername);
        message.setTo(request.getEmail());
        message.setSubject("Bienvenido a nuestra plataforma");
        message.setText("Hola " + request.getName() + ",\n\nBienvenido a AdoptaFacil. ¡Esperamos que disfrutes de nuestra plataforma!\n\nSaludos,\nEl equipo de AdoptaFacil");

        mailSender.send(message);
    }
}