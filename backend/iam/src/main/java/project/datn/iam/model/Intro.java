package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "intro")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Intro {
    @Id
    @Column(name = "id_product")
    private Long id ;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id_product", referencedColumnName = "id_product", foreignKey = @ForeignKey(name = "fk_intro_product"))
    private Product product ;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description ;

    @Column(name = "preserve", columnDefinition = "TEXT")
    private String preserve ;
}
