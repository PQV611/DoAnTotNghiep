package project.datn.iam.service.base;


import project.datn.iam.DTO.ModifyDTO;

public interface IBaseService<Rq, Rs, ID> {
    //    <T> Page<T> search(SearchRequest searchRequest);
    Rs getById(ID id);

    Rs create(Rq request);

    Rs update(ID id, Rq request);

    ModifyDTO delete(ID id);
}
