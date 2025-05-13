package project.datn.iam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.datn.iam.DTO.OrderDTO;
import project.datn.iam.mapper.OrderMapper;
import project.datn.iam.model.Image;
import project.datn.iam.model.Order;
import project.datn.iam.model.OrderDetail;
import project.datn.iam.repository.ImageRepository;
import project.datn.iam.repository.OrderDetailRepository;
import project.datn.iam.repository.OrderRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ImageRepository imageRepository;
    private final OrderMapper orderMapper;

    public Page<OrderDTO> getOrdersByStatus(int status, LocalDateTime fromDate, LocalDateTime toDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByStatusAndDateRange(status, fromDate, toDate, pageable);
        long total = orderRepository.countByStatusAndDateRange(status, fromDate, toDate);

        List<OrderDTO> dtoList = orders.stream().map(order -> {
            List<OrderDetail> items = orderDetailRepository.findByOrderIdOrder(order.getIdOrder());
            List<Image> images = imageRepository.findAllByOrderId(order.getIdOrder());
            return orderMapper.toDTO(order, items, images);
        }).collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, total);
    }

    public void updateStatus(Long id, int newStatus) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    public OrderDTO getOrderDetail(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        List<OrderDetail> items = orderDetailRepository.findByOrderIdOrder(order.getIdOrder());
        List<Image> images = imageRepository.findAllByOrderId(order.getIdOrder());
        return orderMapper.toDTO(order, items, images);
    }
}
