package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.datn.iam.model.Order;
import project.datn.iam.repository.OrderRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private OrderRepository orderRepository;

//    @GetMapping("/revenue")
//    public ResponseEntity<?> getRevenueByMonthYear(
//            @RequestParam("month") int month,
//            @RequestParam("year") int year) {
//
//        Integer totalRevenue = orderRepository.getTotalRevenueByMonthAndYear(month, year);
//        Map<String, Object> response = new HashMap<>();
//        response.put("label", "Tổng doanh thu");
//        response.put("value", totalRevenue != null ? totalRevenue : 0);
//
//        return ResponseEntity.ok(response);
//    }

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueByMonthYear(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {

        List<Order> orders = orderRepository.findByMonthAndYear(month, year);

        int[] weeklyRevenue = new int[4]; // 4 tuần

        for (Order order : orders) {
            int day = order.getCreateAt().getDayOfMonth();

            if (day <= 7) {
                weeklyRevenue[0] += order.getTotalCost();
            } else if (day <= 14) {
                weeklyRevenue[1] += order.getTotalCost();
            } else if (day <= 21) {
                weeklyRevenue[2] += order.getTotalCost();
            } else {
                weeklyRevenue[3] += order.getTotalCost();
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("label", "Tuần " + (i + 1));
            item.put("value", weeklyRevenue[i]);
            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/revenue-by-year")
    public ResponseEntity<?> getRevenueByYear(@RequestParam("year") int year) {
        List<Object[]> results = orderRepository.getMonthlyRevenueOfYear(year);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Integer month = ((Number) row[0]).intValue();
            Long revenue = ((Number) row[1]).longValue();


            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("month", month);
            dataPoint.put("value", revenue != null ? revenue : 0L);
            response.add(dataPoint);
        }

        return ResponseEntity.ok(response);
    }


    @GetMapping("/revenue-by-day")
    public ResponseEntity<?> getRevenueByDay(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {

        List<Object[]> results = orderRepository.getDailyRevenueByMonthAndYear(month, year);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Integer day = ((Number) row[0]).intValue();
            Long revenue = ((Number) row[1]).longValue();

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("day", day);
            dataPoint.put("value", revenue != null ? revenue : 0L);
            response.add(dataPoint);
        }

        return ResponseEntity.ok(response);
    }

//    Hiển thị biểu đồ theo tổng số đơn hàng theo danh mục
    @GetMapping("/order-count-by-category")
    public ResponseEntity<?> getOrderCountByCategory() {
        List<Object[]> results = orderRepository.countOrdersByCategory();
        List<Map<String, Object>> responseList = new ArrayList<>();
        int totalOrders = 0;

        for (Object[] row : results) {
            String category = (String) row[0];
            Long count = (Long) row[1]; // kiểu Long từ COUNT(*)
            totalOrders += count;

            Map<String, Object> data = new HashMap<>();
            data.put("category", category);
            data.put("count", count);
            responseList.add(data);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", responseList);
        response.put("total", totalOrders);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/product-quantity-by-category")
    public ResponseEntity<?> getProductQuantityByCategoryName() {
        List<Object[]> results = orderRepository.getTotalQuantityByCategoryName();
        List<Map<String, Object>> data = new ArrayList<>();
        int totalQuantity = 0;

        for (Object[] row : results) {
            String categoryName = (String) row[0];
            Long quantity = (Long) row[1];

            Map<String, Object> item = new HashMap<>();
            item.put("category", categoryName);
            item.put("quantity", quantity);
            data.add(item);

            totalQuantity += quantity.intValue();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", data);
        response.put("totalQuantity", totalQuantity);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-user-paid")
    public ResponseEntity<?> getTopUserByTotalPaid() {
        Object[] result = orderRepository.findTopUserByTotalPaid();

        if (result == null) {
            return ResponseEntity.ok(Map.of(
                    "avatar", null,
                    "fullname", "Không có dữ liệu",
                    "totalPaid", 0
            ));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("avatar", result[0]);
        response.put("fullname", result[0]);
        response.put("totalPaid", result[0]);

        return ResponseEntity.ok(response);
    }

//    3 label dashboard
    @GetMapping("/summary-payment")
    public ResponseEntity<?> getSummaryPaymentStats() {
        Integer totalRevenue = orderRepository.getTotalRevenue();
        Long codCount = orderRepository.countPaymentMethodCOD();
        Long transferCount = orderRepository.countPaymentMethodTransfer();

        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue != null ? totalRevenue : 0);
        response.put("codOrders", codCount);
        response.put("transferOrders", transferCount);

        return ResponseEntity.ok(response);
    }

//    top 3 product
    @GetMapping("/top-products")
    public ResponseEntity<?> getTop3BestSellingProducts() {
        List<Object[]> results = orderRepository.findTop3BestSellingProducts();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> productData = new HashMap<>();
            productData.put("id", row[0]);
            productData.put("name", row[1]);
            productData.put("price", row[2]);
            productData.put("image", row[3]);
            productData.put("quantitySold", row[4]);
            response.add(productData);
        }

        return ResponseEntity.ok(response);
    }


}
