package kr.sparta.livevotinganswer.service;

import kr.sparta.livevotinganswer.dto.VoteMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoteListener {

    //    private final SimpMessagingTemplate messagingTemplate;
    private final SimpMessageSendingOperations messageSending;

    @KafkaListener(topics = "vote_broadcast_topic", groupId = "#{T(java.util.UUID).randomUUID().toString()}")
    public void listen(VoteMessageDto voteMessageDto) {
        var message = " [ " + voteMessageDto.voteName() + "에 누군가 투표를 진행했습니다! 결과를 확인해보세요!]";
//        messagingTemplate.convertAndSendToUser("/topic/announcements", message);
        messageSending.convertAndSend("/topic/announcements", message);

    }
}
