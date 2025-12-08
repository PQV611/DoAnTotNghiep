package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductHomepageTO {
    private Long id;
    private String nameProduct;
    private BigDecimal price;
    private String image1; // ảnh hiển thị chính
    private String image2;
    private int isActive ;
}
