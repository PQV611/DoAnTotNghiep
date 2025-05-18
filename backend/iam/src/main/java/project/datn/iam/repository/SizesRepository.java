package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Sizes;

import java.util.Optional;

public interface SizesRepository extends JpaRepository<Sizes, Long> {
    Optional<Sizes> findByNameSize(String nameSize);
}
