package project.datn.iam.mapper;

import org.springframework.stereotype.Component;
import project.datn.iam.DTO.UserDTO;
import project.datn.iam.model.User;

@Component
public class UserMapper {
    public UserDTO toDto(User user){
        UserDTO dto = new UserDTO();
        dto.setIdUser(user.getIdUser());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setPassword(user.getPassword());
        dto.setCreateAt(user.getCreateAt());
        dto.setIdRole(user.getRole().getIdRole());
        dto.setNameRole(user.getRole().getNameRole());
        return dto;
    }

    public User toEntity(UserDTO dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        return user;
    }
}
