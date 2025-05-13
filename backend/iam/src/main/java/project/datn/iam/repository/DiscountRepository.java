package project.datn.iam.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.DTO.DiscountDTO;
import project.datn.iam.model.Discount;

import java.util.List;
import java.util.Optional;

public interface DiscountRepository extends JpaRepository<Discount, Long>, JpaSpecificationExecutor<Discount> {
    Optional<Discount> findFirstByProduct_IdAndIsActiveTrue(Long id);
    boolean existsByProduct_Id(Long productId);

    @Query("""
        SELECT new project.datn.iam.DTO.DiscountDTO(
            d.product.id,
            d.product.nameProduct,
            d.numberDiscount,
            d.endDate,
            d.isActive
        )
        FROM Discount d
        WHERE (:keyword IS NULL OR CAST(d.product.id AS string) LIKE %:keyword%
               OR LOWER(d.product.nameProduct) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (
              :status = 'all' OR
              (:status = 'valid' AND d.endDate >= CURRENT_TIMESTAMP) OR
              (:status = 'expired' AND d.endDate < CURRENT_TIMESTAMP)
          )
    """)
    Page<DiscountDTO> searchDiscounts(@Param("keyword") String keyword,
                                      @Param("status") String status,
                                      Pageable pageable);
}
