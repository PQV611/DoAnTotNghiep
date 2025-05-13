package project.datn.iam.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.datn.iam.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private Long idOrder ;

    private User user ;

    private LocalDateTime createAt ;

    private String phone;

    private String address;

    private Integer totalCost;

    private Integer status ; // 1: pending mặc định

    private Integer paymentMethod = 1; // 1: COD mặc định

    private LocalDate expectedDelivery;
}
