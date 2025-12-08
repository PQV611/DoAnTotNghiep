package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Order\"")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order")
    private Long idOrder ;

    @ManyToOne
    @JoinColumn(name = "id_user", foreignKey = @ForeignKey(name = "fk_order_user"))
    private User user ;

    @Column(name = "createat", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createAt ;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "totalcost", nullable = false)
    private Integer totalCost;

    @Column(name = "status", nullable = false)
    private Integer status ; // 1: pending mặc định

    @Column(name = "payment_method", nullable = false)
    private Integer paymentMethod = 1; // 1: COD mặc định

    @Column(name = "expected_delivery")
    private LocalDate expectedDelivery;

    @Column(name = "fullname")
    private String fullname;
}
