package project.datn.iam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import project.datn.iam.DTO.ProductDTO;
import project.datn.iam.DTO.ProductRequest;
import project.datn.iam.DTO.ProductVariantRequest;
import project.datn.iam.mapper.ProductMapper;
import project.datn.iam.model.*;
import project.datn.iam.repository.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired private ProductVariantRepository productVariantRepository;
    @Autowired private OrderDetailRepository orderDetailRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private ImageRepository imageRepository;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private FileStorageService fileStorageService;

//    ADMIN

    public Page<ProductDTO> getProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.searchByName(keyword, pageable);

        List<ProductDTO> dtos = productPage.getContent().stream().map(p -> {
            Long productId = p.getId();
            int totalQty = Optional.ofNullable(productVariantRepository.getTotalQuantityByProductId(productId)).orElse(0);
            int totalSold = Optional.ofNullable(orderDetailRepository.getTotalSoldByProductId(productId)).orElse(0);
            double avgStar = Optional.ofNullable(reviewRepository.getAverageRating(productId)).orElse(0.0);
            BigDecimal price = p.getPrice() ;
            List<String> images = imageRepository.findAllByProductId(productId);
            List<String> colors = productVariantRepository.getColorNames(productId);
            List<String> hexCode = productVariantRepository.getHexCodes(productId);
            List<String> sizes = productVariantRepository.getSizeNames(productId);

            return productMapper.toDTO(p, images, totalQty, totalSold, avgStar, price , colors, hexCode, sizes);
        }).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, productPage.getTotalElements());
    }

    public void addProduct(ProductRequest productRequest) {
        // 1. Tạo Product mới
        Product product = new Product();
        product.setNameProduct(productRequest.getNameProduct());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setCreateAt(LocalDateTime.now());
        product.setCategory(new Categories(productRequest.getCategoryId()));

        // 2. Lưu Product trước để lấy ID
        Product savedProduct = productRepository.save(product);

        // 3. Lưu danh sách biến thể sản phẩm (variants)
        List<ProductVariantRequest> variants = productRequest.getVariants();
        if (variants != null && !variants.isEmpty()) {
            for (ProductVariantRequest variantRequest : variants) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(savedProduct);
                variant.setColor(new Colors(variantRequest.getColorId()));
                variant.setSize(new Sizes(variantRequest.getSizeId()));
                variant.setQuantity(variantRequest.getQuantity());
                variant.setPrice(productRequest.getPrice()); // hoặc cho phép chỉnh giá từng variant riêng
                productVariantRepository.save(variant);
            }
        }

        // 4. Lưu danh sách ảnh sản phẩm
        List<MultipartFile> images = productRequest.getImages();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                String fileName = fileStorageService.saveFile(file); // ghi file vào ổ đĩa
                Image image = new Image();
                image.setProduct(savedProduct); // gán product đã có ID
                image.setImage(fileName);
                imageRepository.save(image);
            }
        }
    }

    @Transactional
    public void updateProduct(Long id, ProductRequest productRequest){
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy mã sản phẩm"));
        product.setNameProduct(productRequest.getNameProduct());
        product.setDescription(productRequest.getDescription());
        product.setCategory(new Categories(productRequest.getCategoryId()));
        product.setPrice(productRequest.getPrice());
        productRepository.save(product);

        //update variants
        if (productRequest.getVariants() != null && !productRequest.getVariants().isEmpty()) {
            productVariantRepository.deleteByProduct_Id(product.getId());

            for (ProductVariantRequest v : productRequest.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(product);
                variant.setColor(new Colors(v.getColorId()));
                variant.setSize(new Sizes(v.getSizeId()));
                variant.setQuantity(v.getQuantity());
                variant.setPrice(product.getPrice());
                productVariantRepository.save(variant);
            }
        }

        //Update image
        List<MultipartFile> newImages = productRequest.getImages();
        if (newImages != null && !newImages.isEmpty()) {
            imageRepository.deleteByProduct_Id(product.getId());

            for (MultipartFile file : newImages) {
                String fileName = fileStorageService.saveFile(file);
                Image image = new Image();
                image.setProduct(product);
                image.setImage(fileName);
                imageRepository.save(image);
            }
        }

    }

    @Transactional
    public void deleteProduct(Long id) {
        productVariantRepository.deleteByProduct_Id(id);
        imageRepository.deleteByProduct_Id(id);
        productRepository.deleteById(id);
    }

    private String saveImageToDisk(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("E:\\DoAnTotNghiep_2025\\IAM_Project\\frontend\\I_AM_frontend\\src\\assets\\imageProduct", fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi lưu ảnh", e);
        }
    }
//    CUSTOMER
}
