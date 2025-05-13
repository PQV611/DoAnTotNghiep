package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductRequest {
    private String nameProduct;
    private String description;
    private Long categoryId;
    private BigDecimal price;

    private List<MultipartFile> images; // ảnh mới
    private List<ProductVariantRequest> variants;
}
