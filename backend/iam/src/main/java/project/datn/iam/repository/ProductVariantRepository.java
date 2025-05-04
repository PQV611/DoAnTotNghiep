package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
}
