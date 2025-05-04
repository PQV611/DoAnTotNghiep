package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Roles;

public interface RolesRepository extends JpaRepository<Roles, Long> {
}
