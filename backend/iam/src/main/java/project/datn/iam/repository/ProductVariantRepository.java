package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.model.ProductVariant;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    @Query("SELECT SUM(pv.quantity) FROM ProductVariant pv WHERE pv.product.id = :productId")
    Integer getTotalQuantityByProductId(@Param("productId") Long productId);

    @Query("SELECT DISTINCT pv.color.nameColor FROM ProductVariant pv WHERE pv.product.id = :productId")
    List<String> getColorNames(@Param("productId") Long productId);

    @Query("SELECT DISTINCT pv.color.hexCode FROM ProductVariant pv WHERE pv.product.id = :productId")
    List<String> getHexCodes(@Param("productId") Long productId);

    @Query("SELECT DISTINCT pv.size.nameSize FROM ProductVariant pv WHERE pv.product.id = :productId")
    List<String> getSizeNames(@Param("productId") Long productId);

    List<ProductVariant> findByProductId(Long productId);

    void deleteByProduct_Id(Long productId);

    Optional<ProductVariant> findByProduct_IdAndColor_IdColorAndSize_IdSize(Long productId, Long colorId, Long sizeId);

    List<ProductVariant> findByProduct_IdAndColor_IdColor(Long productId, Long colorId) ;
}
