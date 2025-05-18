package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.AddToCartDTO;
import project.datn.iam.DTO.CartResponseDTO;
import project.datn.iam.DTO.UpdateCartQuantityDTO;
import project.datn.iam.config.JwtUtil;
import project.datn.iam.model.*;
import project.datn.iam.repository.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/cart")
@PreAuthorize("hasAuthority('USER')")
public class CartController {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private JwtUtil jwtUtil ;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ColorsRepository colorsRepository;
    @Autowired
    private SizesRepository sizesRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private DiscountRepository discountRepository;

    @GetMapping("/total-quantity")
    public ResponseEntity<?> getTotalCartQuantity(Authentication authentication) {
        String username = authentication.getName();
        Integer totalQuantity = cartRepository.getTotalQuantityByUsername(username);
        if(totalQuantity == null) totalQuantity = 0;

        return ResponseEntity.ok(Map.of("totalQuantity", totalQuantity));
    }

    @GetMapping
    public ResponseEntity<?> getCartForCurrentUser(Authentication authentication) {
        String username = authentication.getName();

        List<Cart> cartList = cartRepository.findByUser_Username(username);

        List<CartResponseDTO> cartItems = cartList.stream().map(cart -> {
            Product product = cart.getProductVariant().getProduct() ;
            String color = cart.getProductVariant().getColor().getNameColor();
            String imageUrl = imageRepository.findFirstImageByProductId(product.getId()).orElse("Không thấy ảnh") ;
            String size = cart.getProductVariant().getSize().getNameSize();
            BigDecimal price = cart.getProductVariant().getPrice();
            int quantity = cart.getQuantity();
            return new CartResponseDTO(
                    product.getId(),
                    cart.getIdCart(),
                    cart.getProductVariant().getProduct().getNameProduct(),
                    imageUrl,
                    color,
                    size,
                    quantity,
                    price,
                    price.multiply(BigDecimal.valueOf(quantity))
            );
        }).toList();

        BigDecimal totalCost = cartItems.stream()
                .map(CartResponseDTO::getTotalItemCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("items", cartItems);
        response.put("totalCost", totalCost);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestHeader("Authorization") String authHeader,
                                       @RequestBody AddToCartDTO request) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Người dùng không hợp lệ");
        }

        User user = userOpt.get();

        // Lấy ID màu và size theo tên
        Optional<Colors> colorOpt = colorsRepository.findByNameColor(request.getColor());
        Optional<Sizes> sizeOpt = sizesRepository.findByNameSize(request.getSize());
        if (colorOpt.isEmpty() || sizeOpt.isEmpty())
            return ResponseEntity.badRequest().body("Color hoặc Size không hợp lệ");

        // Tìm ProductVariant dựa trên productId, colorId, sizeId
        Optional<ProductVariant> variantOpt = productVariantRepository.findByProduct_IdAndColor_IdColorAndSize_IdSize(
                request.getProductId(),
                colorOpt.get().getIdColor(),
                sizeOpt.get().getIdSize()
        );



        if (variantOpt.isEmpty())
            return ResponseEntity.badRequest().body("Không tìm thấy biến thể sản phẩm phù hợp");

        ProductVariant variant = variantOpt.get();


        // Kiểm tra nếu đã có trong giỏ thì tăng số lượng
        Optional<Cart> existingCart = cartRepository.findByUserAndProductVariant(user, variant);
        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + request.getQuantity());
            cartRepository.save(cart);
        } else {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setProductVariant(variant);
            newCart.setQuantity(request.getQuantity());
            newCart.setCreateAt(LocalDateTime.now());
            cartRepository.save(newCart);
        }
        //  THÊM ĐÂY: Log để kiểm tra dữ liệu truyền vào
        System.out.println("Tìm variant với:");
        System.out.println("ProductId: " + request.getProductId());
        System.out.println("ColorId: " + colorOpt.map(Colors::getIdColor).orElse(null));
        System.out.println("SizeId: " + sizeOpt.map(Sizes::getIdSize).orElse(null));
        System.out.println("quantity: " + request.getQuantity());
        return ResponseEntity.ok(Map.of("message", "Thêm vào giỏ hàng thành công"));
    }

//    Khi chọn màu sẽ hiển thị ra danh sách size của màu đó
    @GetMapping("/product/sizes-by-color")
    public ResponseEntity<?> getSizesByColor(
            @RequestParam Long productId,
            @RequestParam String colorName) {

        Optional<Colors> colorOpt = colorsRepository.findByNameColor(colorName);
        if (colorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy màu: " + colorName);
        }

        List<ProductVariant> variants = productVariantRepository.findByProduct_IdAndColor_IdColor(
                productId,
                colorOpt.get().getIdColor()
        );

        List<String> sizeNames = variants.stream()
                .map(variant -> variant.getSize().getNameSize())
                .distinct()
                .toList();
        System.out.println("Tìm variant với:");
        System.out.println("ProductId: " + productId);
        System.out.println("ColorId: " + colorOpt.map(Colors::getIdColor).orElse(null));
        return ResponseEntity.ok(sizeNames);
    }

    @GetMapping("/details")
    public ResponseEntity<?> getCartDetails(@RequestHeader("Authorization") String authHeader) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Người dùng không hợp lệ");
        }

        User user = userOpt.get();
        List<Cart> cartItems = cartRepository.findByUser(user);

        List<Map<String, Object>> items = cartItems.stream().map(cart -> {
            ProductVariant variant = cart.getProductVariant();
            Product product = variant.getProduct();
//            String productCode = "SP" + product.getId();
            String image = imageRepository.findFirstImageByProductId(product.getId())
                    .orElse("assets/imageProduct/default.jpg");
            String name = product.getNameProduct();
            String color = variant.getColor().getNameColor();
            String size = variant.getSize().getNameSize();
            // lấy giảm giá nếu có
            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
            Integer numberDiscount = 0;

            BigDecimal originalPrice = product.getPrice();
            BigDecimal salePrice = variant.getPrice(); // giá sau khi giảm
            BigDecimal discountAmount = BigDecimal.valueOf(0);

            if (discountOpt.isPresent()) {
//                BigDecimal originalPrice = BigDecimal.valueOf(product.getPrice());
                numberDiscount = discountOpt.get().getNumberDiscount();

                BigDecimal percent = BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100)); // (1 - percent)
                discountAmount = originalPrice.multiply(percent).multiply(BigDecimal.valueOf(cart.getQuantity()));
                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
            }
//            int numberDiscount = originalPrice.compareTo(BigDecimal.ZERO) > 0
//                    ? originalPrice.subtract(salePrice)
//                    .multiply(BigDecimal.valueOf(100))
//                    .divide(originalPrice, 0, RoundingMode.HALF_UP)
//                    .intValue()
//                    : 0;

            int quantity = cart.getQuantity();
            BigDecimal total = salePrice.multiply(BigDecimal.valueOf(quantity));

            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("productCode", product.getId());
            itemMap.put("productName", name);
            itemMap.put("image", image);
            itemMap.put("color", color);
            itemMap.put("size", size);
            itemMap.put("originalPrice", originalPrice);
            itemMap.put("salePrice", salePrice);
            itemMap.put("discountAmount", discountAmount);
            itemMap.put("numberDiscount", numberDiscount);
            itemMap.put("quantity", quantity);
            itemMap.put("total", total);

            return itemMap;
        }).toList();

        BigDecimal totalCart = items.stream()
                .map(i -> (BigDecimal) i.get("total"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal TongTienHang = items.stream()
                .map(i -> ((BigDecimal) i.get("originalPrice")).multiply(BigDecimal.valueOf((Integer) i.get("quantity"))))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("totalCost", totalCart);
        response.put("totalItems", items.size());
        response.put("TongTienHang", TongTienHang);

        return ResponseEntity.ok(response);
    }


//    Tăng giảm số lượng,
    @PostMapping("/update-quantity")
    public ResponseEntity<?> updateCartQuantity(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateCartQuantityDTO request
    ) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Người dùng không hợp lệ");
        }

        Optional<Colors> colorOpt = colorsRepository.findByNameColor(request.getColor());
        Optional<Sizes> sizeOpt = sizesRepository.findByNameSize(request.getSize());
        if (colorOpt.isEmpty() || sizeOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Color hoặc Size không hợp lệ");
        }

        Optional<ProductVariant> variantOpt = productVariantRepository.findByProduct_IdAndColor_IdColorAndSize_IdSize(
                request.getProductId(), colorOpt.get().getIdColor(), sizeOpt.get().getIdSize());

        if (variantOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy biến thể sản phẩm");
        }

        ProductVariant variant = variantOpt.get();
        User user = userOpt.get();

        Optional<Cart> cartOpt = cartRepository.findByUserAndProductVariant(user, variant);
        if (cartOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy sản phẩm trong giỏ hàng");
        }

        Cart cart = cartOpt.get();
        int newQuantity = request.getQuantityChange();
        if (newQuantity <= 0) {
            cartRepository.delete(cart);
            return ResponseEntity.ok("Đã xoá sản phẩm khỏi giỏ hàng");
        }

        cart.setQuantity(newQuantity);
        cartRepository.save(cart);

        return ResponseEntity.ok(Map.of("message", "Đã cập nhật số lượng"));
    }

//    Xóa sản phảm khỏi giỏ hàng
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeCartItem(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long productId,
            @RequestParam String color,
            @RequestParam String size) {

        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Người dùng không hợp lệ");
        }

        User user = userOpt.get();

        // Tìm id màu và size
        Optional<Colors> colorOpt = colorsRepository.findByNameColor(color);
        Optional<Sizes> sizeOpt = sizesRepository.findByNameSize(size);

        if (colorOpt.isEmpty() || sizeOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Màu hoặc size không hợp lệ");
        }

        // Tìm product variant
        Optional<ProductVariant> variantOpt = productVariantRepository.findByProduct_IdAndColor_IdColorAndSize_IdSize(
                productId, colorOpt.get().getIdColor(), sizeOpt.get().getIdSize()
        );

        if (variantOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy biến thể sản phẩm");
        }

        Optional<Cart> cartItemOpt = cartRepository.findByUserAndProductVariant(user, variantOpt.get());
        if (cartItemOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Không tìm thấy sản phẩm trong giỏ");
        }

        cartRepository.delete(cartItemOpt.get());

        return ResponseEntity.ok(Map.of("message", "Đã xoá sản phẩm khỏi giỏ hàng"));
    }

//    @PostMapping("/checkout")
//    public ResponseEntity<?> checkout(@RequestHeader("Authorization") String authHeader,
//                                      @RequestBody Map<String, Object> checkoutInfo) {
//        String jwt = authHeader.substring(7);
//        String username = jwtUtil.extractUsername(jwt);
//
//        Optional<User> userOpt = userRepository.findByUsername(username);
//        if (userOpt.isEmpty()) {
//            return ResponseEntity.status(401).body("Người dùng không hợp lệ");
//        }
//
//        User user = userOpt.get();
//
//        String fullname = (String) checkoutInfo.get("fullname");
//        String phone = (String) checkoutInfo.get("phone");
//        String address = (String) checkoutInfo.get("address");
//        int paymentMethod = (int) checkoutInfo.get("paymentMethod");
//
//        List<Cart> carts = cartRepository.findByUser(user);
//        if (carts.isEmpty()) return ResponseEntity.badRequest().body("Giỏ hàng trống");
//
//        BigDecimal totalCost = BigDecimal.ZERO;
//
//        Order order = new Order();
//        order.setUser(user);
//        order.setPhone(phone);
//        order.setAddress(address);
//        order.setFullname(fullname);
//        order.setPaymentMethod(paymentMethod);
//        order.setCreateAt(LocalDateTime.now());
//        order.setStatus(1); // chờ phê duyệt
//
//        // ➤ Tạm chưa save order, phải set totalCost trước đã
//
//        for (Cart c : carts) {
//            ProductVariant variant = c.getProductVariant();
//            Product product = variant.getProduct();
//            int quantity = c.getQuantity();
//
//            BigDecimal originalPrice = product.getPrice();
//            BigDecimal salePrice = originalPrice;
//
//            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
//            if (discountOpt.isPresent()) {
//                int numberDiscount = discountOpt.get().getNumberDiscount();
//                BigDecimal percent = BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100));
//                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
//            }
//
//            BigDecimal itemTotal = salePrice.multiply(BigDecimal.valueOf(quantity));
//            totalCost = totalCost.add(itemTotal);
//        }
//
//        order.setTotalCost(totalCost.intValue());
//        orderRepository.save(order); // ✅ Bây giờ mới gọi save, sau khi có totalCost
//
//        for (Cart c : carts) {
//            ProductVariant variant = c.getProductVariant();
//            Product product = variant.getProduct();
//            int quantity = c.getQuantity();
//
//            BigDecimal originalPrice = product.getPrice();
//            BigDecimal salePrice = originalPrice;
//
//            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
//            if (discountOpt.isPresent()) {
//                int numberDiscount = discountOpt.get().getNumberDiscount();
//                BigDecimal percent = BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100));
//                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
//            }
//
//            OrderDetail od = new OrderDetail();
//            od.setOrder(order);
//            od.setProductVariant(variant);
//            od.setQuantity(quantity);
//            od.setOriginalPrice(originalPrice.intValue());
//            od.setPrice(salePrice.intValue());
//
//            orderDetailRepository.save(od);
//
//            // Trừ tồn kho
//            variant.setQuantity(variant.getQuantity() - quantity);
//            productVariantRepository.save(variant);
//        }
//
//        cartRepository.deleteAll(carts);
//
//        return ResponseEntity.ok(Map.of("message", "Đặt hàng thành công", "orderId", order.getIdOrder()));
//    }


    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestHeader("Authorization") String authHeader,
                                      @RequestBody Map<String, Object> checkoutInfo) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Người dùng không hợp lệ");
        }

        User user = userOpt.get();

        String fullname = (String) checkoutInfo.get("fullname");
        String phone = (String) checkoutInfo.get("phone");
        String address = (String) checkoutInfo.get("address");
        int paymentMethod = (int) checkoutInfo.get("paymentMethod");

        List<Cart> carts = cartRepository.findByUser(user);
        if (carts.isEmpty()) return ResponseEntity.badRequest().body("Giỏ hàng trống");

        BigDecimal totalCost = BigDecimal.ZERO;

        // ✅ Tính tổng tiền TRƯỚC KHI lưu Order
        for (Cart c : carts) {
            ProductVariant variant = c.getProductVariant();
            Product product = variant.getProduct();
            int quantity = c.getQuantity();

            BigDecimal originalPrice = product.getPrice();
            BigDecimal salePrice = originalPrice;

            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
            if (discountOpt.isPresent()) {
                int numberDiscount = discountOpt.get().getNumberDiscount();
                BigDecimal percent = BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100));
                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
            }

            BigDecimal itemTotal = salePrice.multiply(BigDecimal.valueOf(quantity));
            totalCost = totalCost.add(itemTotal);
        }

        // ✅ Bây giờ lưu Order khi đã có totalCost
        Order order = new Order();
        order.setUser(user);
        order.setPhone(phone);
        order.setAddress(address);
        order.setFullname(fullname);
        order.setPaymentMethod(paymentMethod);
        order.setCreateAt(LocalDateTime.now());
        order.setStatus(1); // chờ phê duyệt
        order.setTotalCost(totalCost.intValue()); // ✅ tránh lỗi null
        orderRepository.save(order);

        // ✅ Lưu OrderDetail và cập nhật lại số lượng trong kho
        for (Cart c : carts) {
            ProductVariant variant = c.getProductVariant();
            Product product = variant.getProduct();
            int quantity = c.getQuantity();

            BigDecimal originalPrice = product.getPrice();
            BigDecimal salePrice = originalPrice;

            Optional<Discount> discountOpt = discountRepository.findByProductId(product.getId());
            if (discountOpt.isPresent()) {
                int numberDiscount = discountOpt.get().getNumberDiscount();
                BigDecimal percent = BigDecimal.valueOf(numberDiscount).divide(BigDecimal.valueOf(100));
                salePrice = originalPrice.multiply(BigDecimal.ONE.subtract(percent));
            }

            // ✅ Lưu chi tiết đơn hàng
            OrderDetail od = new OrderDetail();
            od.setOrder(order);
            od.setProductVariant(variant);
            od.setQuantity(quantity);
            od.setOriginalPrice(originalPrice.intValue());
            od.setPrice(salePrice.intValue());
            orderDetailRepository.save(od);

            // ✅ Cập nhật số lượng tồn kho
            int currentQty = variant.getQuantity();
            variant.setQuantity(currentQty - quantity);
            productVariantRepository.save(variant);
        }

        // ✅ Xoá giỏ hàng sau khi mua
        cartRepository.deleteAll(carts);

        return ResponseEntity.ok(Map.of("message", "Đặt hàng thành công", "orderId", order.getIdOrder()));
    }

}
