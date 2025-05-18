package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private Integer price;
    private Integer total;
}
