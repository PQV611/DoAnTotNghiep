package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.FavouriteDTO;
import project.datn.iam.config.JwtUtil;
import project.datn.iam.model.*;
import project.datn.iam.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/favourite")
public class FavouriteController {
    @Autowired
    private FavouriteRepository favouriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private DiscountRepository discountRepository;
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/active")
    public ResponseEntity<?> getActiveFavourites(@RequestHeader("Authorization") String authHeader) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if(userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user") ;

        User user = userOpt.get();

        List<Favourite> favourites = favouriteRepository.findByUserAndIsActive(user, 1) ;

        List<FavouriteDTO> result = favourites.stream().map(fav -> {
            Product product = fav.getProduct() ;

            List<String> images = imageRepository.findAllByProductId(product.getId()) ;
            String image1 = images.size() > 0 ? images.get(0) : "" ;
            String image2 = images.size() > 1 ? images.get(1) : image1 ;

            BigDecimal originalPrice = product.getPrice() ;
            BigDecimal salePrice = originalPrice ;
            int numberDiscount = 0 ;
            Boolean activeDiscount = false ;
            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
            if (discountOpt.isPresent()) {
                activeDiscount = discountOpt.get().getIsActive() ;
                numberDiscount = discountOpt.get().getNumberDiscount();

                if(activeDiscount == true){
                    BigDecimal percent = BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100));
                    salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
                }else {
                    numberDiscount = 0 ;
                    salePrice = originalPrice;
                }

//                BigDecimal percent = BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100));
//                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
            }

            return new FavouriteDTO(
                    product.getId(),
                    product.getNameProduct(),
                    originalPrice,
                    salePrice,
                    activeDiscount,
                    numberDiscount,
                    image1,
                    image2,
                    fav.getIsActive()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<?> toggleFavourite(@RequestHeader("Authorization") String authHeader, @PathVariable Long productId) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");

        User user = userOpt.get();

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");

        Product product = productOpt.get();
        FavouriteKey key = new FavouriteKey(productId, user.getIdUser());

        Optional<Favourite> favouriteOpt = favouriteRepository.findById(key);
        Favourite fav;
        if (favouriteOpt.isPresent()) {
            fav = favouriteOpt.get();
            fav.setIsActive(fav.getIsActive() == 1 ? 0 : 1);
        } else {
            fav = new Favourite();
            fav.setId_favourite(key);
            fav.setProduct(product);
            fav.setUser(user);
            fav.setCreateAt(LocalDateTime.now());
            fav.setIsActive(1);
        }
        favouriteRepository.save(fav);

        return ResponseEntity.ok(Map.of("status", fav.getIsActive()));
    }
}
