package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.CategoriesDTO;
import project.datn.iam.model.Categories;
import project.datn.iam.repository.CategoriesRepository;
import project.datn.iam.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/admin/categories")
@CrossOrigin("*")
public class CategoriesController {
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @GetMapping("/categories")
    public List<Categories> getAllCategories() {
        return categoriesRepository.findAll() ;
    }

    @GetMapping
    public ResponseEntity<Page<CategoriesDTO>> searchCategories(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        return ResponseEntity.ok(categoryService.searchCategories(keyword, page, size));
    }


    @PostMapping
    public ResponseEntity<String> addCategory(@RequestBody CategoriesDTO categoriesDTO) {
        categoryService.save(categoriesDTO);
        return ResponseEntity.status(201).body("Thêm danh mục thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Long id, @RequestBody CategoriesDTO categoriesDTO) {
        categoryService.update(id, categoriesDTO);
        return ResponseEntity.ok("Cập nhật thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
