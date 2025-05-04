package project.datn.iam.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FavouriteKey implements Serializable {
    @Column(name = "id_product")
    private Long id_product;

    @Column(name = "id_user")
    private Long id_user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FavouriteKey)) return false;
        FavouriteKey that = (FavouriteKey) o;
        return Objects.equals(id_product, that.id_product) &&
                Objects.equals(id_user, that.id_user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id_product, id_user);
    }
}
