package kr.sparta.livevotinganswer.dto;

import kr.sparta.livevotinganswer.entity.Candidate;

import java.time.LocalDateTime;
import java.util.List;

public record VoteListResponseDto(
        Long id,
        String title,
        String status,
        String author,
        String authorId,
        LocalDateTime createdAt,

        //TODO:: 프론트 코드 바뀌면 제거
        List<Candidate> candidates, // 목록에서는 빈 배열로 보냅니다.
        Long totalVotes
) {}
