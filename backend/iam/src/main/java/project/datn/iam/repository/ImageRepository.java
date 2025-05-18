package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.model.Image;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("SELECT i.image FROM Image i WHERE i.product.id = :productId")
    List<String> findAllByProductId(@Param("productId") Long productId);

    void deleteByProduct_Id(Long id) ;

    // Lấy full entity Image
    @Query("SELECT i FROM Image i WHERE i.product.id = :productId")
    List<Image> findImagesByProductId(@Param("productId") Long productId);

    @Query("SELECT i FROM Image i WHERE i.product.id IN (SELECT od.productVariant.product.id FROM OrderDetail od WHERE od.order.idOrder = :orderId)")
    List<Image> findAllByOrderId(@Param("orderId") Long orderId);

    @Query("SELECT i.image FROM Image i WHERE i.product.id = :productId ORDER BY i.idImage ASC LIMIT 1")
    Optional<String> findFirstImageByProductId(@Param("productId") Long productId);

}
