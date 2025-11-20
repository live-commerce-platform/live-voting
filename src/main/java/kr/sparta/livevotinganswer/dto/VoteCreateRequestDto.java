package kr.sparta.livevotinganswer.dto;

import java.util.List;

public record VoteCreateRequestDto(
        String authorId,
        String title,
        List<String> candidates
) {
}
