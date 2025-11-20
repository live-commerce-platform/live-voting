package kr.sparta.livevotinganswer.controller;

import kr.sparta.livevotinganswer.dto.*;
import kr.sparta.livevotinganswer.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    /**
     * 투표 주제 생성
     * @param requestDto
     * @return
     */
    @PostMapping("/votes")
    public ResponseEntity<String> createVotes(@RequestBody VoteCreateRequestDto requestDto) {
        Long votesId = voteService.createVotes(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(votesId.toString());
    }

    /**
     * 투표 목록 조회
     * @return
     */
    @GetMapping("/votes")
    public ResponseEntity<List<VoteListResponseDto>> getAllVotes() {
        List<VoteListResponseDto> votes = voteService.getAllVotes();
        return ResponseEntity.ok(votes);
    }

    /**
     * 투표 상세 조회
     * @param voteId
     * @return
     */
    @GetMapping("/votes/{voteId}")
    public ResponseEntity<VoteDetailResponseDto> getVoteDetails(@PathVariable Long voteId) {
        VoteDetailResponseDto voteDetails = voteService.getVoteDetails(voteId);
        return ResponseEntity.ok(voteDetails);
    }

    /**
     * 투표 제출 (투표하기)
     * @param voteId
     * @param requestDto
     * @return
     */
    @PostMapping("/votes/{voteId}/vote")
    public ResponseEntity<VoteActionResponseDto> performVote(@PathVariable Long voteId, @RequestBody VoteActionRequestDto requestDto) {
        VoteActionResponseDto response = voteService.performVote(voteId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 투표 종료
     * @param voteId
     * @param requestDto
     * @return
     */
    @PatchMapping("/votes/{voteId}/close")
    public ResponseEntity<VoteCloseResponseDto> closeVote(@PathVariable Long voteId, @RequestBody VoteCloseRequestDto requestDto) {
        VoteCloseResponseDto response = voteService.closeVote(voteId, requestDto);
        return ResponseEntity.ok(response);
    }

    /**
     * 투표 기록 조회
     * @param voteId
     * @param voterId
     * @return
     */
    @GetMapping("/votes/{voteId}/vote-record")
    public ResponseEntity<VoteActionResponseDto> getVoteRecord(@PathVariable Long voteId, @RequestParam String voterId) {
        VoteActionResponseDto response = voteService.getVoteRecord(voteId, voterId);
        return ResponseEntity.ok(response);
    }
}
