package project.datn.iam.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
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
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private UserMapper userMapper;

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
}
