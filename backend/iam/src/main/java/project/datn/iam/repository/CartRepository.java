package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
