package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.DiscountDTO;
import project.datn.iam.DTO.PagedResponse;
import project.datn.iam.repository.DiscountRepository;
import project.datn.iam.service.DiscountService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/discounts")
@CrossOrigin("*")
public class DiscountController {
    @Autowired
    private DiscountService discountService;

    @GetMapping("/search")
    public ResponseEntity<Page<DiscountDTO>> searchDiscounts(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        Page<DiscountDTO> results = discountService.getFilteredDiscounts(keyword, status, page, size);
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> addDiscount(@RequestBody DiscountDTO discountDTO) {
        discountService.createDiscount(discountDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Thêm mã giảm giá thành công");
        return ResponseEntity.ok(response);
    }


    @PutMapping
    public ResponseEntity<Map<String, String>> updateDiscount(@RequestBody DiscountDTO discountDTO) {
        discountService.updateDiscount(discountDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cập mã giảm giá theo mã sản phẩm thành công") ;
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id_product}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id_product) {
        discountService.deleteDiscount(id_product);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã xóa mã giảm giá theo sản phẩm");
        return ResponseEntity.ok(response);
    }

}
