package kr.sparta.livevotinganswer.dto;

public record VoteActionRequestDto(
        Long candidateId,
        String voterId
) {
}
