package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariantDTO {
    private Long colorId;
    private String colorName;
    private String hexCode ;
    private Long sizeId;
    private String sizeName;
    private Integer quantity;
}
