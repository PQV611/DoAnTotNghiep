package project.datn.iam.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long idUser ;
    private String fullName ;
    private String email ;
    private String password ;
    private String username ;
    private LocalDateTime createAt ;
    private Long idRole ;
    private String nameRole ;
}
