package project.datn.iam.mapper.base;

import org.mapstruct.Mapper;
import project.datn.iam.DTO.request.OrderRequest;
import project.datn.iam.DTO.response.OrderResponse;
import project.datn.iam.model.Order;
@Mapper(componentModel = "spring")
public abstract class OrderMapper extends BaseMapper<Order, OrderResponse, OrderRequest> {
}
