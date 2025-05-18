package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Long id ;

    @ManyToOne
    @JoinColumn(name = "id_category", referencedColumnName = "id_category", foreignKey = @ForeignKey(name = "fk_product_category"))
    private Categories category ;

    @Column(name = "nameproduct")
    private String nameProduct ;

    @Column(name = "createat", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createAt ;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description ;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @OneToMany(mappedBy = "product")
    private List<ProductVariant> productVariants;
}
