package kr.sparta.livevotinganswer.dto;

public record CandidateResponseDto(
        Long id,
        String name,
        Long voteCount
) {
}
