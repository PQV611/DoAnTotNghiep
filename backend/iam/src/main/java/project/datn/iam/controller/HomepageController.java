package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import project.datn.iam.DTO.ProductHomepageTO;
import project.datn.iam.config.JwtUtil;
import project.datn.iam.model.Product;
import project.datn.iam.model.User;
import project.datn.iam.repository.FavouriteRepository;
import project.datn.iam.repository.ImageRepository;
import project.datn.iam.repository.ProductRepository;
import project.datn.iam.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class HomepageController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private FavouriteRepository favouriteRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/top5")
    public List<ProductHomepageTO> getTop5Products(@RequestHeader(value = "Authorization", required = false) String authHeader) {

//        String jwt = authHeader.substring(7);
//        String username = jwtUtil.extractUsername(jwt);
//
//        Optional<User> userOpt = userRepository.findByUsername(username);
//        if (userOpt.isEmpty()) return List.of(); // hoặc throw 401
//
//        User user = userOpt.get();

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

        List<Product> products = productRepository.findTop5ByOrderByIdAsc();

        // Lấy danh sách ID sản phẩm đã "tim" của user
//        List<Long> favouriteProductIds = favouriteRepository.findByUserAndIsActive(user, 1)
//                .stream().map(fav -> fav.getProduct().getId())
//                .collect(Collectors.toList());
        final List<Long> favouriteProductIds = favouriteIds;
        return products.stream().map(product -> {
            List<String> images = imageRepository.findAllByProductId(product.getId());

            String image1 = images.size() > 0 ? "assets/imageProduct/" + images.get(0) : "";
            String image2 = images.size() > 1 ? "assets/imageProduct/" + images.get(1) : image1; // fallback

            int isActive = favouriteProductIds.contains(product.getId()) ? 1 : 0;

            return new ProductHomepageTO(
                    product.getId(),
                    product.getNameProduct(),
                    product.getPrice(),
                    image1,
                    image2,
                    isActive
            );
        }).toList();
    }

}
