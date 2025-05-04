package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "discount")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_discount")
    private Long id_discount ;

    @ManyToOne
    @JoinColumn(name = "id_product", referencedColumnName = "id_product", foreignKey = @ForeignKey(name = "fk_discount_product"), nullable = false)
    private Product product ;

    @Column(name = "numberdiscount")
    private Integer numberDiscount ;

    @Column(name = "startdate", nullable = false)
    private LocalDateTime startDate ;

    @Column(name = "enddate")
    private LocalDateTime endDate;

    @Column(name = "isactive", nullable = false)
    private Boolean isActive = true;

    @Column(name = "createat", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createAt;
}
