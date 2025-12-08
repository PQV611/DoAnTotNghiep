package project.datn.iam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.datn.iam.DTO.ProductVariantDTO;
import project.datn.iam.model.ProductVariant;
import project.datn.iam.repository.ProductVariantRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductVariantService {

    @Autowired
    private ProductVariantRepository productVariantRepository;

    public List<ProductVariantDTO> getVariantsByProductId(Long productId) {
        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);
        return variants.stream().map(variant -> new ProductVariantDTO(
                variant.getColor().getIdColor(),
                variant.getColor().getNameColor(),
                variant.getColor().getHexCode(),
                variant.getSize().getIdSize(),
                variant.getSize().getNameSize(),
                variant.getQuantity()
        )).collect(Collectors.toList());
    }
}
