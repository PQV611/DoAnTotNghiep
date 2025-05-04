package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
