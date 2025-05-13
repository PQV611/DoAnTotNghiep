package project.datn.iam.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.OrderDTO;
import project.datn.iam.service.OrderService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/admin/order")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{status}")
    public ResponseEntity<Page<OrderDTO>> getOrdersByStatus(
            @PathVariable int status,
            @RequestParam(required = false, defaultValue = "1900-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime fromDate,
            @RequestParam(required = false, defaultValue = "2100-01-01T00:00:00") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status, fromDate, toDate, page, size));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Map<String, String>> approveOrder(@PathVariable Long id) {
        orderService.updateStatus(id, 2);
        return ResponseEntity.ok(Map.of("message", "Đã chuyển sang đang giao hàng"));
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<Map<String, String>> deliverOrder(@PathVariable Long id) {
        orderService.updateStatus(id, 3);
        return ResponseEntity.ok(Map.of("message", "Đã giao hàng thành công"));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Map<String, String>> cancelOrder(@PathVariable Long id) {
        orderService.updateStatus(id, 4);
        return ResponseEntity.ok(Map.of("message", "Đơn hàng đã bị huỷ"));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<OrderDTO> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderDetail(id));
    }
}
