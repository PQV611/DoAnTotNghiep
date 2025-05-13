package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "review")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_review")
    private Long idReview ;

    @OneToOne
    @JoinColumn(
            name = "id_orderdetail",
            referencedColumnName = "id_orderdetail",
            foreignKey = @ForeignKey(name = "fk_review_orderdetail"),
            nullable = false,
            unique = true
    )
    private OrderDetail orderDetail;

    @Column(name = "numberstar")
    private Integer numberStar;

    @Column(name = "reviewtext", columnDefinition = "TEXT")
    private String reviewText;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "adminreply", columnDefinition = "TEXT")
    private String adminReply;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "createat", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createAt;
}
