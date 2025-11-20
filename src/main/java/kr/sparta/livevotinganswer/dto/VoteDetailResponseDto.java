package kr.sparta.livevotinganswer.dto;

import java.time.LocalDateTime;
import java.util.List;

public record VoteDetailResponseDto(
        Long id,
        String title,
        String status,
        String author,
        String authorId,
        LocalDateTime createdAt,
        List<CandidateResponseDto> candidates,
        Long totalVotes
) {
}
