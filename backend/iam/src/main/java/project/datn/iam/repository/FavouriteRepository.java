package project.datn.iam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.datn.iam.model.Favourite;
import project.datn.iam.model.FavouriteKey;

public interface FavouriteRepository extends JpaRepository<Favourite, FavouriteKey> {
}
