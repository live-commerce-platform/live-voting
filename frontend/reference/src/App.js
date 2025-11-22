import React, { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.js';

// 실제 앱에서는 로그인 정보에서 가져와야 합니다.
const MY_USER_ID = 'user' + Math.floor(Math.random() * 1000);

function App() {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        console.log('Connected to WebSocket with userId:', MY_USER_ID);
        
        // 1. 전체 브로드캐스팅 구독
        client.subscribe('/topic/vote-updates', (message) => {
          alert('📢 [Public] ' + message.body);
        });

        // 2. 개인 알림을 위한 동적 토픽 구독
        const privateTopic = `/topic/private.${MY_USER_ID}`;
        console.log('Subscribing to private topic:', privateTopic);
        client.subscribe(privateTopic, (message) => {
          alert('🔒 [Private] ' + message.body);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const handleVote = () => {
    if (clientRef.current && clientRef.current.connected) {
      const voteRequest = {
        userId: MY_USER_ID,
        voteContent: 'I vote for option A!',
      };
      
      clientRef.current.publish({
        destination: '/app/vote',
        body: JSON.stringify(voteRequest), // 객체를 JSON 문자열로 변환하여 전송
      });
      console.log('Published vote message:', voteRequest);
    } else {
      console.error('Cannot send vote: STOMP client is not connected.');
    }
  };

  return (
    <div className="App">
      <h1>Distributed Voting System</h1>
      <h2>Your User ID: {MY_USER_ID}</h2>
      <p>Click the button to vote. You will receive a private notification, and everyone will see a public one.</p>
      <button onClick={handleVote}>투표</button>
    </div>
  );
}

export default App;
