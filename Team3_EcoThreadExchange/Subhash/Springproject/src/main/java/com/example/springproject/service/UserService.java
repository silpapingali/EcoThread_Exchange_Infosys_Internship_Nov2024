package com.example.springproject.service;

import com.example.springproject.model.User;
import com.example.springproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Register a new user with confirmation email and validation for existing email.
     */
    public User registerUser(User user) throws Exception {
        // Check if the email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists. Try with another email.");
        }

        // Encode the user's password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Generate a confirmation token
        user.setConfirmationToken(UUID.randomUUID().toString());

        // Save the user to the database
        userRepository.save(user);

        // Send confirmation email
        sendConfirmationEmail(user);

        return user;
    }

    /**
     * Send a confirmation email to the user with a confirmation token link.
     */
    private void sendConfirmationEmail(User user) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("Complete Your Registration");
        mailMessage.setText("To confirm your account, please click the link below:\n" +
                "http://localhost:8080/api/users/confirm?token=" + user.getConfirmationToken());
        mailSender.send(mailMessage);
    }

    /**
     * Handle user login.
     */
    public Optional<User> loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    /**
     * Find user by email.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Confirm user registration using the confirmation token.
     */
    public boolean confirmUser(String token) {
        Optional<User> user = userRepository.findByConfirmationToken(token);
        if (user.isPresent()) {
            User confirmedUser = user.get();
            confirmedUser.setEnabled(true); // Enable the user after confirmation
            confirmedUser.setConfirmationToken(null); // Clear the token after use
            userRepository.save(confirmedUser);
            return true;
        }
        return false;
    }

    /**
     * Handle Forgot Password - Generate Reset Token.
     */
    public String forgotPassword(String email) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String resetToken = UUID.randomUUID().toString();
            User resetUser = user.get();
            resetUser.setResetToken(resetToken);
            userRepository.save(resetUser);

            // Send reset password email
            sendPasswordResetEmail(resetUser);

            return resetToken; // For testing; in production, do not expose tokens like this
        } else {
            throw new Exception("Email not found.");
        }
    }

    /**
     * Send password reset email.
     */
    private void sendPasswordResetEmail(User user) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("Password Reset Request");
        mailMessage.setText("To reset your password, click the link below:\n" +
                "http://localhost:8080/api/users/reset-password?token=" + user.getResetToken());
        mailSender.send(mailMessage);
    }

    /**
     * Reset user password using a valid token.
     */
    public void resetPassword(String token, String newPassword) throws Exception {
        Optional<User> user = userRepository.findByResetToken(token);
        if (user.isPresent()) {
            User resetUser = user.get();
            resetUser.setPassword(passwordEncoder.encode(newPassword));
            resetUser.setResetToken(null); // Clear the token after reset
            userRepository.save(resetUser);
        } else {
            throw new Exception("Invalid reset token.");
        }
    }
}
