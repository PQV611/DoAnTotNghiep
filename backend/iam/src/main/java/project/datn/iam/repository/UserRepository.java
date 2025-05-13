package project.datn.iam.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.datn.iam.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("""
        SELECT u FROM User u
        WHERE (:role = 'all' OR LOWER(u.role.nameRole) = LOWER(:role))
        AND (
            LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
    """)
    Page<User> searchUsers(@Param("keyword") String keyword,
                           @Param("role") String role,
                           Pageable pageable);
}
