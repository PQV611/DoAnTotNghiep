package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCategoryDTO {
    private Long id;
    private String nameProduct;
    private Integer numberDiscount ;
//    private Boolean activeDiscount ;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private String image1;
    private String image2;
    private int isActive ;
}
