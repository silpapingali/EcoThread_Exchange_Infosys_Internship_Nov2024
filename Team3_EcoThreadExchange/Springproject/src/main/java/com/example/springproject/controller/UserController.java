package com.example.springproject.controller;

import com.example.springproject.model.User;
import com.example.springproject.repository.UserRepository;
import com.example.springproject.service.UserService;
import com.example.springproject.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register a new user and send a confirmation email.
     */
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        // Check if the email is already in use
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered. Try with a different email.";
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Generate a confirmation token
        String confirmationToken = UUID.randomUUID().toString();
        user.setConfirmationToken(confirmationToken);
        user.setEnabled(false); // Initially set the user as not enabled

        // Save the user to the database
        userRepository.save(user);

        // Send confirmation email
        String confirmationLink = "http://localhost:8080/api/users/confirm?token=" + confirmationToken;
        emailService.sendConfirmationEmail(user.getEmail(), confirmationLink);

        return "Registration successful. Please check your email to confirm your account.";
    }

    /**
     * Confirm user email using the confirmation token.
     */
    @GetMapping("/confirm")
    public String confirmUser(@RequestParam("token") String token) {
        Optional<User> optionalUser = userRepository.findByConfirmationToken(token);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEnabled(true); // Mark the user as enabled
            user.setConfirmationToken(null); // Clear the token
            userRepository.save(user);
            return "Email confirmed successfully!";
        } else {
            return "Invalid confirmation link!";
        }
    }

    /**
     * Handle user login.
     */
    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password) {
        Optional<User> user = userService.loginUser(email, password);
        return user.isPresent() ? "Login successful" : "Invalid credentials";
    }

    /**
     * Generate a password reset token for the user.
     */
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        try {
            String resetToken = userService.forgotPassword(email);
            // In production, you'd send this token via email instead of returning it in the response.
            return "Password reset token sent to your email.";
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    /**
     * Reset user password using a valid token.
     */
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            userService.resetPassword(token, newPassword);
            return "Password reset successful";
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}
