package kr.sparta.livevoting.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커를 활성화합니다.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 1. 메시지를 발행하는 요청의 prefix (클라이언트가 메시지를 보낼 때 사용)
        config.setApplicationDestinationPrefixes("/app");

        // 2. 메시지를 구독하는 요청의 prefix (서버가 클라이언트에게 메시지를 보낼 때 사용)
        //    /topic: 전체 구독자에게 브로드캐스트
        //    /queue: 특정 사용자에게 1:1 메시지 (개인 메시징)
        //    /user: Spring이 자동으로 사용자별 세션을 관리하여 개인 메시징을 위한 목적지
        config.enableSimpleBroker("/topic", "/queue", "/user");

        // 3. 특정 사용자에게 메시지를 보내는 prefix를 명시적으로 설정합니다.
        //    이 설정으로 Spring은 /user/{sessionId}/queue/notifications 와 같은 경로를 자동으로 처리합니다.
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결을 위한 STOMP 엔드포인트를 등록합니다.
        // 클라이언트는 이 경로로 WebSocket 연결을 시작합니다. (예: ws://localhost:8080/ws)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // 모든 도메인에서의 접근을 허용합니다. (개발 시 유용)
                .withSockJS(); // SockJS를 사용하여 WebSocket을 지원하지 않는 브라우저에서도 동작하도록 합니다.
    }

}
