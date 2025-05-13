package project.datn.iam.service;

import jakarta.el.Expression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import project.datn.iam.DTO.DiscountDTO;
import project.datn.iam.mapper.DiscountMapper;
import project.datn.iam.model.Discount;
import project.datn.iam.model.Product;
import project.datn.iam.repository.DiscountRepository;
import project.datn.iam.repository.ProductRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

@Service
public class DiscountService {
    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DiscountMapper discountMapper;

    public Page<DiscountDTO> getFilteredDiscounts(String keyword, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return discountRepository.searchDiscounts(keyword, status, pageable);
    }

    public void createDiscount(DiscountDTO dto) {
        if (discountRepository.existsByProduct_Id(dto.getId_product())) {
            throw new RuntimeException("Sản phẩm đã có mã giảm giá!");
        }

        Product p = productRepository.findById(dto.getId_product()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mã sản phẩm"));
        Discount discount = discountMapper.toEntity(dto, p) ;
        discount.setCreateAt(LocalDateTime.now());
        discountRepository.save(discount);
    }

    public void updateDiscount(DiscountDTO dto) {
        Discount discount = discountRepository
                .findFirstByProduct_IdAndIsActiveTrue(dto.getId_product())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá đang hoạt động cho sản phẩm này."));

        discount.setNumberDiscount(dto.getNumberDiscount());
        discount.setEndDate(dto.getEndDate());
        discount.setIsActive(dto.getIsActive());
        // Nếu không có startDate thì mặc định là current time
//        discount.setStartDate(dto.getStartDate() != null ? dto.getStartDate() : LocalDateTime.now());

        discountRepository.save(discount);
    }


    public void deleteDiscount(Long id_product) {
        Discount discount = discountRepository
                .findFirstByProduct_IdAndIsActiveTrue(id_product)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã giảm giá đang hoạt động cho sản phẩm này."));

        discountRepository.delete(discount);
    }


}
