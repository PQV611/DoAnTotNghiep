package project.datn.iam.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Categories;

public interface CategoriesRepository extends JpaRepository<Categories, Long> {
    Page<Categories> findByNameCategoryContainingIgnoreCase(String keyword, Pageable pageable);

}
