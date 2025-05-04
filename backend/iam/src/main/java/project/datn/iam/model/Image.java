package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "image")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_image")
    private Long id_image ;

    @ManyToOne
    @JoinColumn(
            name = "id_product",
            referencedColumnName = "id_product",
            foreignKey = @ForeignKey(name = "fk_image_product"),
            nullable = false
    )
    private Product product ;

    @Column(name = "image", nullable = false, columnDefinition = "TEXT")
    private String image;
}
