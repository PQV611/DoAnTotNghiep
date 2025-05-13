package project.datn.iam.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {
    // Đường dẫn tuyệt đối đến thư mục ảnh trong frontend
    private final Path uploadDir = Paths.get("E:/DoAnTotNghiep_2025/IAM_Project/frontend/I_AM_frontend/src/assets/imageProduct");

    public FileStorageService() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục lưu trữ ảnh", e);
        }
    }

    public String saveFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File trống");
        }

        String originalFilename = file.getOriginalFilename();
        String fileName = System.currentTimeMillis() + "_" + originalFilename;

        try {
            Path targetPath = uploadDir.resolve(fileName).normalize();
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu file: " + originalFilename, e);
        }
    }
}
