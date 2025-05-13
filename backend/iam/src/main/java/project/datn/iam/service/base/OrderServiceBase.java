package project.datn.iam.service.base;

import org.springframework.stereotype.Service;
import project.datn.iam.DTO.request.OrderRequest;
import project.datn.iam.DTO.response.OrderResponse;
import project.datn.iam.mapper.base.OrderMapper;
import project.datn.iam.model.Order;
import project.datn.iam.repository.OrderRepository;
@Service
public class OrderServiceBase extends BaseService<Order,Long, OrderRequest, OrderResponse, OrderRepository, OrderMapper>{
    @Override
    protected void validRequestCreate(OrderRequest request) {
        super.validRequestCreate(request);
    }

    @Override
    protected void validRequestUpdate(Long aLong, OrderRequest request, Order entity) {
        super.validRequestUpdate(aLong, request, entity);
    }

    @Override
    protected void afterMappingRequestToEntity(OrderRequest request, Order entity) {
        super.afterMappingRequestToEntity(request, entity);
    }

    @Override
    protected void afterSaveEntity(Order entity, OrderRequest request) {
        super.afterSaveEntity(entity, request);
    }

    @Override
    protected void mapUpdatedEntity(OrderRequest request, Order entity) {
        super.mapUpdatedEntity(request, entity);
    }

    @Override
    protected void beforeDelete(Long aLong, Order entity) {
        super.beforeDelete(aLong, entity);
    }
}
