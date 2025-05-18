package project.datn.iam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.datn.iam.DTO.RegisterRequest;
import project.datn.iam.DTO.UserChangePassDTO;
import project.datn.iam.DTO.UserDTO;
import project.datn.iam.DTO.UserUpdateDTO;
import project.datn.iam.mapper.UserMapper;
import project.datn.iam.model.Roles;
import project.datn.iam.model.User;
import project.datn.iam.repository.RolesRepository;
import project.datn.iam.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toDto).collect(Collectors.toList());
    }

    public Page<UserDTO> getUsersWithFilter(String keyword, String role, Pageable pageable) {
        return userRepository.searchUsers(keyword, role, pageable).map(userMapper::toDto);
    }

    public void createUser(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        user.setCreateAt(LocalDateTime.now());

        Roles defaultRole = rolesRepository.findByNameRole("user")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền mặc định USER"));
        user.setRole(defaultRole);

        userRepository.save(user);
    }

    public void updateUser(Long id, UserUpdateDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        user.setFullName(userDTO.getFullName());

        Roles newRole = rolesRepository.findByNameRole(userDTO.getNameRole()).orElseThrow(() -> new RuntimeException("Không tìm thấy quyền: " + userDTO.getNameRole()));
        user.setRole(newRole);
        userRepository.save(user);
    }

    public void changePassword(Long id, UserChangePassDTO dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy user")) ;
        user.setPassword(dto.getNewPassword());
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String role = user.getRole().getNameRole();
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.toUpperCase()));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    public String registerUser(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setCreateAt(LocalDateTime.now());

        Roles role = new Roles();
        role.setIdRole(1L); // Default role: user
        user.setRole(role);

        userRepository.save(user);
        return "Đăng ký thành công!";
    }
}
