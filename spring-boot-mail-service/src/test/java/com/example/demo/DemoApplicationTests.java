package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.mail.host=localhost",
    "spring.mail.port=587",
    "spring.mail.username=test",
    "spring.mail.password=test",
    "MAIL_HOST=localhost",
    "MAIL_PORT=587",
    "MAIL_USERNAME=test",
    "MAIL_PASSWORD=test"
})
class DemoApplicationTests {

    @Test
    void contextLoads() {
    }

}