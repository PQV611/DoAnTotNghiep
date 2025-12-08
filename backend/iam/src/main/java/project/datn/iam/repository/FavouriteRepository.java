package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Favourite;
import project.datn.iam.model.FavouriteKey;
import project.datn.iam.model.User;

import java.util.List;

public interface FavouriteRepository extends JpaRepository<Favourite, FavouriteKey> {
    List<Favourite> findByUserAndIsActive(User user, Integer isActive);
}
