package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT AVG(r.numberStar) FROM Review r WHERE r.orderDetail.productVariant.product.id = :productId")
    Double getAverageRating(@Param("productId") Long productId);
}
