package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountDTO {
    private Long id_product ;
    private String name_product ;
    private Integer numberDiscount ;
//    private LocalDateTime startDate ;
    private LocalDateTime endDate ;
    private Boolean isActive ;
}
