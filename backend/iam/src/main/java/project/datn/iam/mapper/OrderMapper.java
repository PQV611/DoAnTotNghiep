//package project.datn.iam.mapper;
//
//import org.springframework.stereotype.Component;
//import project.datn.iam.DTO.OrderDTO;
//import project.datn.iam.DTO.OrderItemDTO;
//import project.datn.iam.model.Image;
//import project.datn.iam.model.Order;
//import project.datn.iam.model.OrderDetail;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Component
//public class OrderMapper {
//    public OrderDTO toDTO(Order order, List<OrderDetail> orderItems, List<Image> productImage) {
//        OrderDTO dto = new OrderDTO();
//        dto.setIdOrder(order.getIdOrder());
//        dto.setIdUser(order.getUser().getIdUser());
//        dto.setFullname(order.getUser().getFullName());
//        dto.setAddress(order.getAddress());
//        dto.setPhone(order.getPhone());
//        dto.setTotalCost(order.getTotalCost());
//        dto.setPaymentMethod(order.getPaymentMethod() == 1 ? "Tiền mặt" : "VNPay");
//        dto.setCreateAt(order.getCreateAt());
//        dto.setStatus(order.getStatus());
//        dto.setStatusText(switch (order.getStatus()) {
//            case 1 -> "Chờ phê duyệt";
//            case 2 -> "Đang giao hàng";
//            case 3 -> "Giao hàng thành công";
//            case 4 -> "Đã huỷ";
//            default -> "Không rõ";
//        });
//
//        dto.setOrderItemList(orderItems.stream().map(od -> {
//            OrderItemDTO dtoItem = new OrderItemDTO();
//            dtoItem.setProductName(od.getProductVariant().getProduct().getNameProduct());
//            dtoItem.setQuantity(od.getQuantity());
//            dtoItem.setPrice(od.getPrice());
//
//            Long productId = od.getProductVariant().getProduct().getId();
//            String imageUrl =  productImage.stream()
//                    .filter(img -> img.getProduct().getId().equals(productId))
//                    .map(Image::getImage)
//                    .findFirst()
//                    .orElse(null);
//            dtoItem.setImageUrl("assets/imageProduct/" + imageUrl);
//            return dtoItem;
//        }).collect(Collectors.toList()));
//        return dto;
//    }
//}

package project.datn.iam.mapper;

import org.springframework.stereotype.Component;
import project.datn.iam.DTO.OrderDTO;
import project.datn.iam.DTO.OrderItemDTO;
import project.datn.iam.model.Order;
import project.datn.iam.model.OrderDetail;
import project.datn.iam.model.Product;
import project.datn.iam.repository.ImageRepository;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    private final ImageRepository imageRepository;

    public OrderMapper(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public OrderDTO toDTO(Order order, List<OrderDetail> orderDetails) {
        List<OrderItemDTO> itemDTOs = orderDetails.stream().map(detail -> {
            Product product = detail.getProductVariant().getProduct();

            // Lấy ảnh đại diện (nếu có)
            List<String> images = imageRepository.findAllByProductId(product.getId());
            String imageUrl = images.isEmpty() ? "" : "assets/imageProduct/" + images.get(0);

            return new OrderItemDTO(
                    product.getNameProduct(),
                    imageUrl,
                    detail.getQuantity(),
                    detail.getPrice(),
                    detail.getTotal()
            );
        }).collect(Collectors.toList());
        Integer totalCost = (int) itemDTOs.stream()
                .mapToDouble(OrderItemDTO::getTotal)
                .sum();
        return new OrderDTO(
                order.getIdOrder(),
                order.getUser().getIdUser(),
                order.getUser().getFullName(),
                order.getPhone(),
                order.getAddress(),
                totalCost,
                getPaymentMethodText(order.getPaymentMethod()),
                order.getCreateAt(),
                order.getStatus(),
                getStatusText(order.getStatus()),
                itemDTOs
        );
    }

//    private Integer getTotalCost(Order order) {
//
//    }

    private String getPaymentMethodText(int method) {
        return switch (method) {
            case 1 -> "Thanh toán khi nhận hàng (COD)";
            case 2 -> "Thanh toán VNPay";
            default -> "Không xác định";
        };
    }

    private String getStatusText(int status) {
        return switch (status) {
            case 1 -> "Chờ phê duyệt";
            case 2 -> "Đang giao hàng";
            case 3 -> "Giao hàng thành công";
            case 4 -> "Đã huỷ";
            default -> "Không xác định";
        };
    }
}

