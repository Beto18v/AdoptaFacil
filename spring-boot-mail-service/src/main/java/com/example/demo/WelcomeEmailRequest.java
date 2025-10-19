package com.example.demo;

public class WelcomeEmailRequest {
    private String email;
    private String name;

    public WelcomeEmailRequest() {
    }

    public WelcomeEmailRequest(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}