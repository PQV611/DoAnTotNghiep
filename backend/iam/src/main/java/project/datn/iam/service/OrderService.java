package project.datn.iam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
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
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ImageRepository imageRepository;
    private final OrderMapper orderMapper;

//    public Page<OrderDTO> getOrdersByStatus(int status, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createAt").descending());
//        Page<Order> orders = orderRepository.findByStatus(status, pageable);
//        List<OrderDTO> dtoList = orders.stream().map(order -> {
//            List<OrderDetail> items = orderDetailRepository.findByOrderIdOrder(order.getIdOrder());
//            List<Image> images = imageRepository.findAllByOrderId(order.getIdOrder());
//            return orderMapper.toDTO(order, items);
//        }).collect(Collectors.toList());
//        return new PageImpl<>(dtoList, pageable, orders.getTotalElements());
//    }

    public Page<OrderDTO> getOrders(Integer status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
//        Page<Order> orderPage = orderRepository.findByStatus(status, pageable);

        if (status == null || status == 0){
            Page<Order> orderPage = orderRepository.findAll(pageable);
            List<OrderDTO> dtos = orderPage.getContent().stream().map(order -> {
                List<OrderDetail> details = orderDetailRepository.findByOrder(order);
                return orderMapper.toDTO(order, details);
            }).collect(Collectors.toList());

            return new PageImpl<>(dtos, pageable, orderPage.getTotalElements());
        }else {
            Page<Order> orderPage = orderRepository.findByStatus(status, pageable);
            List<OrderDTO> dtos = orderPage.getContent().stream().map(order -> {
                List<OrderDetail> details = orderDetailRepository.findByOrder(order);
                return orderMapper.toDTO(order, details);
            }).collect(Collectors.toList());

            return new PageImpl<>(dtos, pageable, orderPage.getTotalElements());
        }
    }

    public void updateStatus(Long id, int newStatus) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    public void updateOrderStatus(Long orderId, int newStatus) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new NoSuchElementException("Không tìm thấy đơn hàng"));
        order.setStatus(newStatus);
        orderRepository.save(order);
    }


}
