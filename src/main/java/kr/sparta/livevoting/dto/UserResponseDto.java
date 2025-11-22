package kr.sparta.livevoting.dto;

import kr.sparta.livevoting.entity.User;
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
