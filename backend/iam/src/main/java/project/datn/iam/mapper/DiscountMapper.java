package project.datn.iam.mapper;

import org.springframework.stereotype.Component;
import project.datn.iam.DTO.DiscountDTO;
import project.datn.iam.model.Discount;
import project.datn.iam.model.Product;

import java.time.LocalDateTime;

@Component
public class DiscountMapper {
    public Discount toEntity(DiscountDTO dto, Product product) {
        Discount discount = new Discount();
        discount.setProduct(product) ;
        discount.setNumberDiscount(dto.getNumberDiscount());
//        discount.setStartDate(LocalDateTime.now());
        discount.setEndDate(dto.getEndDate());
        discount.setIsActive(dto.getIsActive());
        return discount;
    }

    public DiscountDTO toDTO(Discount entity) {
        DiscountDTO dto = new DiscountDTO();
        dto.setId_product(entity.getProduct().getId());
        dto.setName_product(entity.getProduct().getNameProduct());
        dto.setNumberDiscount(entity.getNumberDiscount());
//        dto.setStartDate(LocalDateTime.now());
        dto.setEndDate(entity.getEndDate());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }
}
