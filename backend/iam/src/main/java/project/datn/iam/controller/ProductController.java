package project.datn.iam.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.datn.iam.DTO.ProductDTO;
import project.datn.iam.DTO.ProductRequest;
import project.datn.iam.DTO.ProductVariantRequest;
import project.datn.iam.service.ProductService;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Page<ProductDTO> result = productService.getProducts(keyword, page, size);
        return ResponseEntity.ok(result);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> addProduct(
            @RequestPart("nameProduct") String nameProduct,
            @RequestPart("description") String description,
            @RequestPart("price") BigDecimal price,
            @RequestPart("categoryId") Long categoryId,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "variants", required = false) String variantsJson
    ) {
        List<ProductVariantRequest> variants = parseVariants(variantsJson);

        ProductRequest request = new ProductRequest();
        request.setNameProduct(nameProduct);
        request.setDescription(description);
        request.setPrice(price);
        request.setCategoryId(categoryId);
        request.setImages(images);
        request.setVariants(variants);

        productService.addProduct(request);
        return ResponseEntity.ok(Map.of("message", "Thêm sản phẩm thành công"));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, String>> updateProduct(
            @PathVariable Long id,
            @RequestPart("nameProduct") String nameProduct,
            @RequestPart("description") String description,
            @RequestPart("price") BigDecimal price,
            @RequestPart("categoryId") Long categoryId,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "variants", required = false) String variantsJson
    ) {
        List<ProductVariantRequest> variants = parseVariants(variantsJson);

        ProductRequest request = new ProductRequest();
        request.setNameProduct(nameProduct);
        request.setDescription(description);
        request.setPrice(price);
        request.setCategoryId(categoryId);
        request.setImages(images);
        request.setVariants(variants);

        productService.updateProduct(id, request);
        return ResponseEntity.ok(Map.of("message", "Cập nhật sản phẩm thành công"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Xoá sản phẩm thành công"));
    }

    private List<ProductVariantRequest> parseVariants(String variantsJson) {
        if (variantsJson == null || variantsJson.isBlank()) return Collections.emptyList();
        try {
            return Arrays.asList(objectMapper.readValue(variantsJson, ProductVariantRequest[].class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Không parse được variants JSON", e);
        }
    }
}
