package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
}
