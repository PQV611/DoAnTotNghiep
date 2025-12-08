package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Colors;

import java.util.Optional;

public interface ColorsRepository extends JpaRepository<Colors, Long> {
    Optional<Colors> findByNameColor(String nameColor);
}
