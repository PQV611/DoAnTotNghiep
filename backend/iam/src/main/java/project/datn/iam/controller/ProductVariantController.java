package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.datn.iam.DTO.ProductVariantDTO;
import project.datn.iam.service.ProductVariantService;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
public class ProductVariantController {
    @Autowired
    private ProductVariantService productVariantService;

    @GetMapping("/{id}/variants")
    public ResponseEntity<List<ProductVariantDTO>> getVariantsByProductId(@PathVariable Long id) {
        List<ProductVariantDTO> variants = productVariantService.getVariantsByProductId(id);
        return ResponseEntity.ok(variants);
    }

}
