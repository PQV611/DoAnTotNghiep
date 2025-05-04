package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Sizes;

public interface SizesRepository extends JpaRepository<Sizes, Long> {
}
