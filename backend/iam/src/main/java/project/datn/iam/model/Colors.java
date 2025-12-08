package project.datn.iam.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "colors")
public class Colors {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_color")
    private Long idColor ;

    @Column(name = "name_color")
    private String nameColor ;

    @Column(name = "hex_code")
    private String hexCode ;

    public Colors(Long idColor) {
        this.idColor = idColor;
    }
}
