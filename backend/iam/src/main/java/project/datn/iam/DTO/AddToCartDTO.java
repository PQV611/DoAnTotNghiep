package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddToCartDTO {
    private Long productId ;
    private String color;
    private String size;
    private Integer quantity ;
}
