package project.datn.iam.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.DTO.OrderDTO;
import project.datn.iam.model.Order;
import project.datn.iam.model.OrderDetail;
import project.datn.iam.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
//    List<Order> findByStatus(Integer status);
    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.status = :status)")
    Page<Order> findByStatus(@Param("status") Integer status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND " +
            "(:from IS NULL OR o.createAt >= :from) AND (:to IS NULL OR o.createAt <= :to)")
    Page<Order> findByStatusAndDateRange(@Param("status") int status,
                                         @Param("from") LocalDateTime from,
                                         @Param("to") LocalDateTime to,
                                         Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE o.status = :status " +
            "AND (:fromDate IS NULL OR o.createAt >= :fromDate) " +
            "AND (:toDate IS NULL OR o.createAt <= :toDate)")
    long countByStatusAndDateRange(int status, LocalDateTime from, LocalDateTime to);

    List<Order> findByUser(User user);

}
