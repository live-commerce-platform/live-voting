package kr.sparta.livevotinganswer.controller;

import kr.sparta.livevotinganswer.dto.UserResponseDto;
import kr.sparta.livevotinganswer.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class UserController {

    private final UserService userService;

    /**
     * 사용자 목록 조회
     * @return
     */
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getUsers() {
        List<UserResponseDto> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }
}
