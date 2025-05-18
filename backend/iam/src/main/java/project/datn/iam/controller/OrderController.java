package project.datn.iam.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.OrderDTO;
import project.datn.iam.DTO.response.OrderResponse;
import project.datn.iam.config.JwtUtil;
import project.datn.iam.model.*;
import project.datn.iam.repository.ImageRepository;
import project.datn.iam.repository.OrderDetailRepository;
import project.datn.iam.repository.OrderRepository;
import project.datn.iam.repository.UserRepository;
import project.datn.iam.service.OrderService;
import project.datn.iam.service.base.OrderServiceBase;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/order")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;
    @Autowired
    private final OrderServiceBase serviceBase;

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ImageRepository imageRepository;

    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getOrders(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ResponseEntity.ok(orderService.getOrders(status, page, size));
    }

    @GetMapping("/{status}")
    public ResponseEntity<Page<OrderDTO>> getOrders2(
            @PathVariable Integer status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ResponseEntity.ok(orderService.getOrders(status, page, size));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveOrder(@PathVariable Long id) {
        orderService.updateOrderStatus(id, 2);
        return ResponseEntity.ok(Map.of("message", "Đã phê duyệt đơn hàng"));
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> deliverOrder(@PathVariable Long id) {
        orderService.updateOrderStatus(id, 3);
        return ResponseEntity.ok(Map.of("message", "Giao hàng thành công"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        orderService.updateOrderStatus(id, 4);
        return ResponseEntity.ok(Map.of("message", "Đơn hàng đã bị huỷ"));
    }

//    BÊN CUSTOMER: xem lịch sử mua hàng
    @GetMapping("/history")
    public ResponseEntity<?> getUserOrders(@RequestHeader("Authorization") String authHeader) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid user");
        }

        User user = userOpt.get();
        List<Order> orders = orderRepository.findByUser(user);
        Collections.reverse(orders);

        List<Map<String, Object>> result = orders.stream().map(order -> {
            Map<String, Object> orderMap = new LinkedHashMap<>();
            orderMap.put("orderId", order.getIdOrder());
            orderMap.put("orderCode", "IAM" + order.getIdOrder());
            orderMap.put("createdAt", order.getCreateAt().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy")));
            orderMap.put("status", order.getStatus());
            orderMap.put("paymentMethod", order.getPaymentMethod() == 1 ? "Thanh toán khi nhận hàng" : "VNPay");
            orderMap.put("totalCost", order.getTotalCost());

            List<OrderDetail> details = orderDetailRepository.findByOrder(order);

            List<Map<String, Object>> items = details.stream().map(detail -> {
                Map<String, Object> item = new HashMap<>();
                item.put("productName", detail.getProductVariant().getProduct().getNameProduct());
                item.put("quantity", detail.getQuantity());
                return item;
            }).collect(Collectors.toList());


            orderMap.put("items", items);
            return orderMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }


    //Chi tiết đơn hàng của khách hàng đó
    @GetMapping("/detail/{orderId}")
    public ResponseEntity<?> getOrderDetail(@PathVariable Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        List<OrderDetail> details = orderDetailRepository.findByOrder(order);

        List<Map<String, Object>> products = details.stream().map(detail -> {
            ProductVariant variant = detail.getProductVariant();
            Product product = variant.getProduct();

            String firstImage = product.getProductVariants().stream()
                    .flatMap(v -> v.getProduct().getProductVariants().stream())
                    .findFirst()
                    .map(v -> {
                        // Bạn cần có ImageRepository để lấy ảnh đầu tiên theo productId
                        // Nếu có, sửa đoạn này thành imageRepository.findAllByProductId(product.getId()).get(0)
                        return imageRepository.findAllByProductId(product.getId()).get(0); // placeholder nếu chưa xử lý ảnh
                    }).orElse("assets/imageProduct/default.jpg");

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("productId", product.getId());
            item.put("productName", product.getNameProduct());
            item.put("image", firstImage);
            item.put("color", variant.getColor().getNameColor());
            item.put("size", variant.getSize().getNameSize());
            item.put("quantity", detail.getQuantity());
            item.put("total", detail.getTotal());
            return item;
        }).toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("orderId", order.getIdOrder());
        result.put("orderCode", "IAM" + order.getIdOrder());
        result.put("createdAt", order.getCreateAt().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy")));
        result.put("status", order.getStatus()) ;
        result.put("paymentMethod", order.getPaymentMethod() == 1 ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán qua VNPay");
        result.put("customerName", order.getUser().getFullName());
        result.put("fullname", order.getFullname()) ;
        result.put("address", order.getAddress());
        result.put("phone", order.getPhone());
        result.put("products", products);
        result.put("totalCost", order.getTotalCost());

        return ResponseEntity.ok(result);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelOrderByCustomer(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        order.setStatus(4); // Đã huỷ
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Đơn hàng đã được huỷ"));
    }

    @PutMapping("/confirm-received/{id}")
    public ResponseEntity<?> confirmReceivedByCustomer(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();

        Order order = orderOpt.get();
        order.setStatus(3); // Giao hàng thành công
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Đã xác nhận đã nhận hàng"));
    }
}
