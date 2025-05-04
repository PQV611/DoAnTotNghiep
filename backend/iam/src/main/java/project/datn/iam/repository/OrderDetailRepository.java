package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
}
