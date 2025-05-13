package project.datn.iam.mapper.base;

import org.mapstruct.MappingTarget;

import java.util.List;

public abstract class BaseMapper<E, S, Q> {
    public abstract E convertRequest2Entity( Q request);
    public abstract S convertEntity2Response( E entity);
    public abstract List<E> convertListRequest2ListEntity(List<Q> listRequest);
    public abstract List<S> convertListEntity2ListResponse(List<E> listEntity);

    public abstract void updateEntity(Q request, @MappingTarget E entity);
}

