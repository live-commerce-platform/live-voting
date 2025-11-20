package kr.sparta.livevotinganswer.dto;

import kr.sparta.livevotinganswer.entity.User;

public record UserResponseDto(
        String id,
        String name
) {
    public static UserResponseDto from(User user) {
        return new UserResponseDto(
                user.getLoginId(),
                user.getNickname()
        );
    }
}
