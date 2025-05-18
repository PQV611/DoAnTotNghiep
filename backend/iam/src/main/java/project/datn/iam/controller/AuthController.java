package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.datn.iam.DTO.AuthRequest;
import project.datn.iam.DTO.AuthResponse;
import project.datn.iam.DTO.RegisterRequest;
import project.datn.iam.config.JwtUtil;
import project.datn.iam.repository.UserRepository;
import project.datn.iam.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        final UserDetails userDetails = userService.loadUserByUsername(authRequest.getUsername()) ;
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt));
    }

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
//        return ResponseEntity.ok(userService.registerUser(registerRequest)) ;
//    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String message = userService.registerUser(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", message
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Đăng ký thất bại: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
//        String username = authentication.getName();
//        return userRepository.findByUsername(username).map(user -> ResponseEntity.ok(Map.of(
//                "username", user.getUsername(),
//                "fullName", user.getFullName(),
//                "role", user.getRole().getNameRole(),
//                "idUser", user.getIdUser(),
//                "avatar", user.getAvatar(),
//                "birth", user.getBirth(),
//                "phone", user.getPhone(),
//                "address", user.getAddress()
//        ))).orElse(ResponseEntity.notFound().build());
        String username = authentication.getName();

        return userRepository.findByUsername(username).map(user -> {
            Map<String, Object> result = new HashMap<>();

            result.put("username", user.getUsername());
            result.put("fullName", Optional.ofNullable(user.getFullName()).orElse("Chưa cập nhật"));
            result.put("role", Optional.ofNullable(user.getRole())
                    .map(r -> r.getNameRole())
                    .orElse("UNKNOWN"));
            result.put("idUser", user.getIdUser());
            result.put("avatar", Optional.ofNullable(user.getAvatar()).orElse("assets/images/default-avatar.png"));
            result.put("birth", Optional.ofNullable(user.getBirth()).map(Object::toString).orElse("Chưa cập nhật"));
            result.put("phone", Optional.ofNullable(user.getPhone()).orElse("Chưa cập nhật"));
            result.put("address", Optional.ofNullable(user.getAddress()).orElse("Chưa cập nhật"));

            return ResponseEntity.ok(result);
        }).orElse(ResponseEntity.notFound().build());
    }
}
