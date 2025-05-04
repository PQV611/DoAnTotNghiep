package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
