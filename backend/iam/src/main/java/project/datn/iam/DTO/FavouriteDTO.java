package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavouriteDTO {
    private Long idProduct;
    private String nameProduct;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private Boolean activeDiscount ;
    private int numberDiscount;
    private String image1;
    private String image2;
    private Integer isActive;
}
