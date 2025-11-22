package kr.sparta.livevoting.service;

import jakarta.transaction.Transactional;
import kr.sparta.livevoting.dto.UserResponseDto;
import kr.sparta.livevoting.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public List<UserResponseDto> getUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDto::from)
                .collect(Collectors.toList());
    }
}
