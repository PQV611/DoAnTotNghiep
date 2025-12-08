package project.datn.iam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.datn.iam.DTO.CategoriesDTO;
import project.datn.iam.mapper.CategoriesMapper;
import project.datn.iam.model.Categories;
import project.datn.iam.repository.CategoriesRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private CategoriesMapper categoriesMapper;

    public Page<CategoriesDTO> searchCategories(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoriesRepository.findByNameCategoryContainingIgnoreCase(keyword, pageable)
                .map(categoriesMapper::toDTO);
    }

    public Page<CategoriesDTO> getCategoriesWithPaging(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoriesRepository.findAll(pageable)
                .map(categoriesMapper::toDTO);
    }

    public void save(CategoriesDTO categoriesdto) {
        categoriesRepository.save(categoriesMapper.toEntity(categoriesdto));
    }

    public void update(Long id, CategoriesDTO categoriesDTO) {
        Categories updateCategory = categoriesRepository.findById(id).orElse(null);
        if( updateCategory != null ){
            updateCategory.setNameCategory(categoriesDTO.getName_category());
            categoriesRepository.save(updateCategory);
        }
    }

    public void deleteById(Long id) {
        categoriesRepository.deleteById(id);
    }
}
