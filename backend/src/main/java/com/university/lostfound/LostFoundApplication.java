package com.university.lostfound;

import com.university.lostfound.entity.User;
import com.university.lostfound.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
public class LostFoundApplication {

    public static void main(String[] args) {
        SpringApplication.run(LostFoundApplication.class, args);
    }

    @Bean
    public CommandLineRunner initPasswords(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                // Ensure default demo users have valid BCrypt hash for "Password@123"
                if (!passwordEncoder.matches("Password@123", user.getPassword())) {
                    user.setPassword(passwordEncoder.encode("Password@123"));
                    userRepository.save(user);
                }
            }
        };
    }
}
