package project.datn.iam.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.model.Product;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE LOWER(p.nameProduct) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByName(@Param("keyword") String keyword, Pageable pageable);

    List<Product> findTop5ByOrderByIdAsc();

    @Query("""
    SELECT p FROM Product p
    LEFT JOIN p.productVariants pv
    WHERE (:categoryId IS NULL OR p.category.id_category = :categoryId)
      AND (:sizeOption IS NULL OR pv.size.nameSize = :sizeOption)
      AND (:minPrice IS NULL OR p.price >= :minPrice)
      AND (:maxPrice IS NULL OR p.price <= :maxPrice)
      
""")
    Page<Product> filterProducts(
            @Param("categoryId") Integer categoryId,
            @Param("sizeOption") String sizeOption,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    @Query("""
    SELECT p FROM Product p
    WHERE (:categoryId IS NULL OR p.category.id_category = :categoryId)
""")
    Page<Product> filterProducts2(@Param("categoryId") Integer categoryId,Pageable pageable);

    @Query("""
    SELECT DISTINCT p FROM Product p
    LEFT JOIN p.productVariants pv
    LEFT JOIN pv.size s
    WHERE (:keyword IS NULL OR LOWER(p.nameProduct) LIKE LOWER(CONCAT('%', :keyword, '%')))
      AND (:sizeOption IS NULL OR s.nameSize = :sizeOption)
      AND (:minPrice IS NULL OR p.price >= :minPrice)
      AND (:maxPrice IS NULL OR p.price <= :maxPrice)
""")
    Page<Product> searchByKeywordAndOption(
            @Param("keyword") String keyword,
            @Param("sizeOption") String sizeOption,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );


}
