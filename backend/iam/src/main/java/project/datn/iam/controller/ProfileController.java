package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import project.datn.iam.DTO.UserProfileDTO;
import project.datn.iam.config.JwtUtil;
import project.datn.iam.model.User;
import project.datn.iam.repository.UserRepository;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class ProfileController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(
            @RequestHeader("Authorization") String authHeader
    ) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        UserProfileDTO dto = new UserProfileDTO(
                user.getFullName() != null ? user.getFullName() : "Chưa cập nhật",
                user.getBirth() != null ? user.getBirth().toString() : "Chưa cập nhật",
                user.getPhone() != null ? user.getPhone() : "Chưa cập nhật",
                user.getAddress() != null ? user.getAddress() : "Chưa cập nhật",
                user.getEmail() != null ? user.getEmail() : "Chưa có email",
                user.getAvatar() != null ? user.getAvatar() : "assets/images/default-avatar.png"
        );

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String fullName,
            @RequestParam String birth,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String email,
            @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile
    ) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");

        User user = userOpt.get();
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setAddress(address);
        user.setEmail(email);

        try {
            if (!birth.isBlank()) {
                user.setBirth(LocalDate.parse(birth));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ngày sinh không hợp lệ");
        }

        // Lưu tên file ảnh
        if (avatarFile != null && !avatarFile.isEmpty()) {
            String fileName = avatarFile.getOriginalFilename();
            user.setAvatar(fileName);

            // Gợi ý: bạn có thể lưu ảnh vào thư mục: ./uploads/
            File uploadDir = new File("E:/DoAnTotNghiep_2025/IAM_Project/frontend/I_AM_frontend/src/assets/imageProduct");

            if (!uploadDir.exists()) {
                uploadDir.mkdirs(); // tạo nếu chưa có
            }

            String fileName2 = System.currentTimeMillis() + "_" + avatarFile.getOriginalFilename(); // tránh trùng tên

            File dest = new File(uploadDir, fileName2);
            try {
                avatarFile.transferTo(dest);
            } catch (IOException | IllegalStateException e) {
                e.printStackTrace(); // log lỗi nếu cần
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Lỗi khi lưu file ảnh");
            }

        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message","Cập nhật thành công"));
    }


    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String currentPassword,
            @RequestParam String newPassword
    ) {
        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");

        User user = userOpt.get();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu hiện tại không đúng");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
    }

}
