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

    // Lấy tổng doanh thu theo tháng & năm
//    @Query("SELECT SUM(o.totalCost) FROM Order o WHERE MONTH(o.createAt) = :month AND YEAR(o.createAt) = :year AND o.status <> 4")
//    Integer getTotalRevenueByMonthAndYear(@Param("month") int month, @Param("year") int year);

    //Lấy doanh thu 4 tuần trong tháng cảu năm
    @Query("SELECT o FROM Order o WHERE MONTH(o.createAt) = :month AND YEAR(o.createAt) = :year")
    List<Order> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

//    Lấy doanh thu 12 tháng theo năm
    @Query("SELECT MONTH(o.createAt), SUM(o.totalCost) " +
            "FROM Order o " +
            "WHERE YEAR(o.createAt) = :year " +
            "GROUP BY MONTH(o.createAt) " +
            "ORDER BY MONTH(o.createAt)")
    List<Object[]> getMonthlyRevenueOfYear(@Param("year") int year);

//    Doanh thu tất cả các ngày trong tháng theo năm
    @Query("SELECT DAY(o.createAt), SUM(o.totalCost) " +
            "FROM Order o " +
            "WHERE MONTH(o.createAt) = :month AND YEAR(o.createAt) = :year " +
            "GROUP BY DAY(o.createAt) ORDER BY DAY(o.createAt)")
    List<Object[]> getDailyRevenueByMonthAndYear(@Param("month") int month, @Param("year") int year);

//    Hiển thị tổng số đoơn hàng theo danh mục
    @Query("""
        SELECT c.nameCategory, COUNT(od.idOrderdetail)
        FROM OrderDetail od
        JOIN od.productVariant pv
        JOIN pv.product p
        JOIN p.category c
        GROUP BY c.nameCategory
    """)
    List<Object[]> countOrdersByCategory();

    @Query("""
    SELECT c.nameCategory, SUM(od.quantity)
    FROM OrderDetail od
    JOIN od.productVariant pv
    JOIN pv.product p
    JOIN p.category c
    GROUP BY c.nameCategory
""")
    List<Object[]> getTotalQuantityByCategoryName();

//    Chọn ra tài khoản mua hàng nhiều nhất
    @Query("""
    SELECT o.user.avatar, o.user.fullName, SUM(o.totalCost)
    FROM Order o
    WHERE o.status IN (2, 3)  
    GROUP BY o.user.idUser, o.user.avatar, o.user.fullName
    ORDER BY SUM(o.totalCost) DESC
    LIMIT 1
""")
    Object[] findTopUserByTotalPaid();


    @Query("SELECT SUM(o.totalCost) FROM Order o")
    Integer getTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentMethod = 1")
    Long countPaymentMethodCOD();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentMethod = 2")
    Long countPaymentMethodTransfer();

    @Query(value = """
    SELECT
        p.id_product,
        p.nameproduct,
        p.price,
        (SELECT i.image
         FROM image i
         WHERE i.id_product = p.id_product
         ORDER BY i.id_image ASC
         LIMIT 1) as image_url,
        SUM(od.quantity) as total_quantity
    FROM orderdetail od
    JOIN productvariant pv ON od.id_productvariant = pv.id_productvariant
    JOIN product p ON pv.id_product = p.id_product
    GROUP BY p.id_product, p.nameproduct, p.price
    ORDER BY total_quantity DESC
    LIMIT 3
    """, nativeQuery = true)
    List<Object[]> findTop3BestSellingProducts();



}
