package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "favourite")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Favourite {
    @EmbeddedId
    private FavouriteKey id_favourite;

    @ManyToOne
    @MapsId("id_product")
    @JoinColumn(
            name = "id_product",
            referencedColumnName = "id_product",
            foreignKey = @ForeignKey(name = "fk_favourite_product")
    )
    private Product product;

    @ManyToOne
    @MapsId("id_user")
    @JoinColumn(
            name = "id_user",
            referencedColumnName = "id_user",
            foreignKey = @ForeignKey(name = "fk_favourite_user")
    )
    private User user;

    @Column(name = "createat", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createAt;

    @Column(name = "isactive", nullable = false)
    private Integer isActive = 1;
}
