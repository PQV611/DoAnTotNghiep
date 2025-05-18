package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {
    private Long idProduct ;
    private String nameProduct;
    private String code;
    private double rating; // Số sao đánh giá
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private int numberDiscount;
    private List<String> colors;
    private List<String> sizes;
    private String mainImage;
    private List<String> imageList;
}
