package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductTextRequest {
    private String nameProduct;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private List<ProductVariantRequest> variants;
}
