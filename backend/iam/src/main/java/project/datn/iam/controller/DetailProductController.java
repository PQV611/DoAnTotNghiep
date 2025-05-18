package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.ProductDetailDTO;
import project.datn.iam.model.Discount;
import project.datn.iam.model.Product;
import project.datn.iam.model.ProductVariant;
import project.datn.iam.repository.DiscountRepository;
import project.datn.iam.repository.ImageRepository;
import project.datn.iam.repository.ProductRepository;
import project.datn.iam.repository.ProductVariantRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/detail")
public class DetailProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetail(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) return ResponseEntity.notFound().build();

        Product product = productOpt.get();

        // Lấy giá gốc và giá sau khi giảm
        BigDecimal originalPrice = product.getPrice();
        int numberDiscount = discountRepository.findByProductId(id)
                .map(Discount::getNumberDiscount)
                .orElse(0);
        BigDecimal salePrice = originalPrice.multiply(
                BigDecimal.ONE.subtract(BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100)))
        );

        // Lấy danh sách ảnh
        List<String> images = imageRepository.findAllByProductId(id)
                .stream()
                .map(img -> "assets/imageProduct/" + img)
                .toList();
        String mainImage = images.isEmpty() ? "" : images.get(0);

        // Lấy màu và size từ ProductVariant
        List<ProductVariant> variants = productVariantRepository.findByProductId(id);
        List<String> colors = variants.stream()
                .map(v -> v.getColor().getNameColor())
                .distinct()
                .toList();
        List<String> sizes = variants.stream()
                .map(v -> v.getSize().getNameSize())
                .distinct()
                .toList();

        // Tạm thời số sao hardcode là 5.0 (có thể tính từ bảng Review sau)
        double rating = 5.0;

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setIdProduct(product.getId());
        dto.setNameProduct(product.getNameProduct());
        dto.setCode("SP" + product.getId());
        dto.setRating(rating);
        dto.setOriginalPrice(originalPrice);
        dto.setSalePrice(salePrice);
        dto.setNumberDiscount(numberDiscount);
        dto.setColors(colors);
        dto.setSizes(sizes);
        dto.setMainImage(mainImage);
        dto.setImageList(images);

        return ResponseEntity.ok(dto);
    }

}
