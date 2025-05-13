package project.datn.iam.mapper;

import org.springframework.stereotype.Component;
import project.datn.iam.DTO.ProductDTO;
import project.datn.iam.model.Product;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product, List<String> images, int totalQty, int soldQty,
                            double avgStar, BigDecimal price,
                            List<String> colors, List<String> hexCode, List<String> sizes) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setNameProduct(product.getNameProduct());
        dto.setDescription(product.getDescription());
        dto.setCategoryId(product.getCategory().getId_category());
        dto.setCategoryName(product.getCategory().getNameCategory());
        dto.setTotalQuantity(totalQty);
        dto.setTotalSold(soldQty);
        dto.setAverageRating(avgStar);
        dto.setPrice(price);
        dto.setImageUrls(images);
        dto.setColorNames(colors);
        dto.setHexCodes(hexCode);
        dto.setSizeNames(sizes);
        return dto;
    }
}

