package kr.sparta.livevotinganswer.dto;

public record VoteMessageDto(
        String voteName,
        String candidateName,
        String userSessionId
) {
}
