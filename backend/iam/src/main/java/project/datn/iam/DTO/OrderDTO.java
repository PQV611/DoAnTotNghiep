package project.datn.iam.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDTO {
    private Long idOrder ;
    private Long idUser ;
    private String fullname ;
    private String phone ;
    private String address ;
    private Integer totalCost ;
    private String paymentMethod ;
    private LocalDateTime createAt ;
    private Integer status ;
    private String statusText ;
    private List<OrderItemDTO> orderItemList ;
}
