package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.PagedResponse;
import project.datn.iam.DTO.UserChangePassDTO;
import project.datn.iam.DTO.UserDTO;
import project.datn.iam.DTO.UserUpdateDTO;
import project.datn.iam.mapper.UserMapper;
import project.datn.iam.model.User;
import project.datn.iam.repository.UserRepository;
import project.datn.iam.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/account")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getUsers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "all") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ResponseEntity.ok(userService.getUsersWithFilter(keyword, role, PageRequest.of(page, size)));
    }


    @PostMapping
    public ResponseEntity<Map<String, String>> createUser(@RequestBody UserDTO userDTO) {
        userService.createUser(userDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã thêm tài khoản thành công");

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO userDTO) {
        userService.updateUser(id, userDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã cập nhật tài khoản thành công") ;
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã xoá tài khoản thành công") ;
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@PathVariable Long id, @RequestBody UserChangePassDTO dto) {
        userService.changePassword(id, dto);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã cập nhật mật khẩu thành công") ;
        return ResponseEntity.ok(response);
    }
}
