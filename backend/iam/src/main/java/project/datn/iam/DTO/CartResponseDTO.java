package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
    private Long id;
    private Long cartId;
    private String productName;
    private String imageUrl ;
    private String color;
    private String size;
    private int quantity;
    private BigDecimal price;
    private BigDecimal totalItemCost;
}
