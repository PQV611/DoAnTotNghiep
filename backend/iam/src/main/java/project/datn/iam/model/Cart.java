package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cart")
    private Long id_cart ;

    @ManyToOne
    @JoinColumn(
            name = "id_user",
            referencedColumnName = "id_user",
            foreignKey = @ForeignKey(name = "fk_cart_user"),
            nullable = false
    )
    private User user ;

    @ManyToOne
    @JoinColumn(
            name = "id_productvariant",
            referencedColumnName = "id_productvariant",
            foreignKey = @ForeignKey(name = "fk_cart_productvariant"),
            nullable = false
    )
    private ProductVariant productVariant;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "createat", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createAt;
}
