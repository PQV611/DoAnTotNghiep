package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Colors;

public interface ColorsRepository extends JpaRepository<Colors, Long> {
}
