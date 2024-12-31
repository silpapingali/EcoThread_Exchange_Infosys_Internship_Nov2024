package com.example.springproject.repository;

import com.example.springproject.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Find user by confirmation token (used for email verification)
    Optional<User> findByConfirmationToken(String confirmationToken);

    // Find user by email (used for login and registration validation)
    Optional<User> findByEmail(String email);

    // Find user by reset token (used for password reset functionality)
    Optional<User> findByResetToken(String resetToken);
}
