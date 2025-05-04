package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
