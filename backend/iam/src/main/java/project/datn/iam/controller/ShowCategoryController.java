package project.datn.iam.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.ProductCategoryDTO;
import project.datn.iam.config.JwtUtil;
import project.datn.iam.model.Discount;
import project.datn.iam.model.Product;
import project.datn.iam.model.User;
import project.datn.iam.repository.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/category")
public class ShowCategoryController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FavouriteRepository favouriteRepository;

    @GetMapping("/all2")
    public Page<ProductCategoryDTO> getFilteredProducts(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String sizeOption,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String keyword
    ) {
        Pageable pageable = PageRequest.of(page, size);

        // Xử lý token (nếu có)
        List<Long> favouriteIds = List.of();
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            String username = jwtUtil.extractUsername(jwt);
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                favouriteIds = favouriteRepository.findByUserAndIsActive(user, 1)
                        .stream().map(fav -> fav.getProduct().getId()).toList();
            }
        }
        final List<Long> favouriteProductIds = favouriteIds;

        // gọi custom query
        Page<Product> productsPage ;
            // Nếu lọc theo danh mục
        if(categoryId == null || categoryId == 0) {
            productsPage = productRepository.findAll(pageable);
        }else {
            productsPage = productRepository.filterProducts(categoryId, sizeOption, minPrice, maxPrice, pageable);
        }

        return productsPage.map(product -> {
            List<String> images = imageRepository.findAllByProductId(product.getId());
            String image1 = images.size() > 0 ? "assets/imageProduct/" + images.get(0) : "";
            String image2 = images.size() > 1 ? "assets/imageProduct/" + images.get(1) : image1;

            BigDecimal originalPrice = product.getPrice();
            BigDecimal salePrice = originalPrice;


            // lấy giảm giá nếu có
            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
            Integer discountValue = 0;
            Boolean discountActive = null;
            if (discountOpt.isPresent()) {
//                BigDecimal originalPrice = BigDecimal.valueOf(product.getPrice());
                discountValue = discountOpt.get().getNumberDiscount();
                discountActive = discountOpt.get().getIsActive();

                if(discountActive == true) {
                    BigDecimal percent = BigDecimal.valueOf(discountValue).divide(BigDecimal.valueOf(100)); // (1 - percent)
                    salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
                }else {
//                    BigDecimal percent = BigDecimal.valueOf(discountValue).divide(BigDecimal.valueOf(100));
                    discountValue = 0;
                    salePrice = originalPrice ;
                }

//                BigDecimal percent = BigDecimal.valueOf(discountValue).divide(BigDecimal.valueOf(100)); // (1 - percent)
//                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
            }
//            Boolean activeDiscount ;
//            if (dateTimeFromDB.isBefore(LocalDateTime.now())) {
//                return false;
//            }

            int isActive = favouriteProductIds.contains(product.getId()) ? 1 : 0;

            return new ProductCategoryDTO(
                    product.getId(),
                    product.getNameProduct(),
                    discountValue,
                    discountActive,
                    originalPrice,
                    salePrice,
                    image1,
                    image2,
                    isActive
            );
        });
    }


    @GetMapping("/search")
    public Page<ProductCategoryDTO> getFilteredProducts(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword
    ) {
        Pageable pageable = PageRequest.of(page, size);

        List<Long> favouriteIds = List.of();
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            String username = jwtUtil.extractUsername(jwt);
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                favouriteIds = favouriteRepository.findByUserAndIsActive(user, 1)
                        .stream().map(fav -> fav.getProduct().getId()).toList();
            }
        }
        final List<Long> favouriteProductIds = favouriteIds;

        // gọi custom query
        Page<Product> productsPage = productRepository.searchByName(keyword, pageable) ;

        return productsPage.map(product -> {
            List<String> images = imageRepository.findAllByProductId(product.getId());
            String image1 = images.size() > 0 ? "assets/imageProduct/" + images.get(0) : "";
            String image2 = images.size() > 1 ? "assets/imageProduct/" + images.get(1) : image1;

            BigDecimal originalPrice = product.getPrice();
            BigDecimal salePrice = originalPrice;


            // lấy giảm giá nếu có
            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
            Integer discountValue = 0;
            Boolean discountActive = null;
            if (discountOpt.isPresent()) {
//                BigDecimal originalPrice = BigDecimal.valueOf(product.getPrice());
                discountValue = discountOpt.get().getNumberDiscount();
                discountActive = discountOpt.get().getIsActive();

                if(discountActive == true) {
                    BigDecimal percent = BigDecimal.valueOf(discountValue).divide(BigDecimal.valueOf(100)); // (1 - percent)
                    salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
                }else {
                    discountValue = 0;
                    salePrice = originalPrice;
                }

//                BigDecimal percent = BigDecimal.valueOf(discountValue).divide(BigDecimal.valueOf(100)); // (1 - percent)
//                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
            }
            int isActive = favouriteProductIds.contains(product.getId()) ? 1 : 0;

            return new ProductCategoryDTO(
                    product.getId(),
                    product.getNameProduct(),
                    discountValue,
                    discountActive,
                    originalPrice,
                    salePrice,
                    image1,
                    image2,
                    isActive
            );
        });
    }
}
