package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "productvariant")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_productvariant")
    private Long idProductvariant ;

    @ManyToOne
    @JoinColumn(name = "id_product", referencedColumnName = "id_product",
            foreignKey = @ForeignKey(name = "fk_variant_product"),
            nullable = false)
    private Product product ;

    @ManyToOne
    @JoinColumn(
            name = "id_size",
            referencedColumnName = "id_size",
            foreignKey = @ForeignKey(name = "fk_variant_size"),
            nullable = false
    )
    private Sizes size;

    @ManyToOne
    @JoinColumn(
            name = "id_color",
            referencedColumnName = "id_color",
            foreignKey = @ForeignKey(name = "fk_variant_color"),
            nullable = false
    )
    private Colors color;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;
}
