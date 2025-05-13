package project.datn.iam.mapper;

import org.springframework.stereotype.Component;
import project.datn.iam.DTO.CategoriesDTO;
import project.datn.iam.model.Categories;

@Component
public class CategoriesMapper {
//    Entity -> DTO
    public CategoriesDTO toDTO(Categories categories) {
        return new CategoriesDTO(categories.getId_category(), categories.getNameCategory());
    }

//    DTO -> Entity
    public Categories toEntity(CategoriesDTO categoriesDTO) {
        Categories entity = new Categories();
        entity.setId_category(categoriesDTO.getId_category());
        entity.setNameCategory(categoriesDTO.getName_category());
        return entity ;
    }
}
