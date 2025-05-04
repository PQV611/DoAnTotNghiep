package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Intro;

public interface IntroRepository extends JpaRepository<Intro, Long> {
}
