package kr.sparta.livevotinganswer.dto;

import java.time.LocalDateTime;

public record VoteActionResponseDto(
        Long voteId,
        Long candidateId,
        String voterId,
        LocalDateTime votedAt
) {
}
