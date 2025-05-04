package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
