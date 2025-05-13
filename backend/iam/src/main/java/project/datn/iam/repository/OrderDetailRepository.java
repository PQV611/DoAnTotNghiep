package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.model.Order;
import project.datn.iam.model.OrderDetail;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    @Query("SELECT SUM(od.quantity) FROM OrderDetail od WHERE od.productVariant.product.id = :productId")
    Integer getTotalSoldByProductId(@Param("productId") Long productId);

    List<OrderDetail> findByOrder(Order order);

    List<OrderDetail> findByOrderIdOrder(Long orderId);
}
