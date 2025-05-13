package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String nameProduct;
    private String description;
    private Long categoryId;
    private String categoryName;
    private int totalQuantity;
    private int totalSold;
    private double averageRating;
    private BigDecimal price ;
    private List<String> imageUrls;
    private List<String> colorNames;
    private List<String> hexCodes ;
    private List<String> sizeNames;
}

