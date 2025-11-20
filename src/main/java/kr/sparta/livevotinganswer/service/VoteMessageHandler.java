package kr.sparta.livevotinganswer.service;

import kr.sparta.livevotinganswer.dto.VoteMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class VoteMessageHandler {

    private final VoteService voteService;
    private final KafkaTemplate<String, VoteMessageDto> kafkaTemplate;

    @MessageMapping("/vote-created")
    @SendToUser("/queue/notification")
    public String vote(@Payload VoteMessageDto voteMessageDto, Principal principal) {

        //단체용 알림을 위해 kafka에 메시지 전송
        kafkaTemplate.send("vote_broadcast_topic", voteMessageDto);

        //개인용 알림 실행
        var message = voteMessageDto.voteName() + " 투표의 " + voteMessageDto.candidateName() + " 에 투표가 완료되었습니다.";
        return message;
    }


}
