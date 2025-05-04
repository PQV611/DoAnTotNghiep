package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
