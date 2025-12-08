package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.model.Cart;
import project.datn.iam.model.ProductVariant;
import project.datn.iam.model.User;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT SUM(c.quantity) FROM Cart c WHERE c.user.username = :username")
    Integer getTotalQuantityByUsername(@Param("username") String username);

    List<Cart> findByUser_Username(String username);

    Optional<Cart> findByUserAndProductVariant(User user, ProductVariant variant);
    List<Cart> findByUser(User user);
}
