package kr.sparta.livevotinganswer.service;

import kr.sparta.livevotinganswer.dto.*;
import kr.sparta.livevotinganswer.entity.*;
import kr.sparta.livevotinganswer.exception.AuthorizationException;
import kr.sparta.livevotinganswer.exception.ResourceNotFoundException;
import kr.sparta.livevotinganswer.repository.CandidateRepository;
import kr.sparta.livevotinganswer.repository.UserRepository;
import kr.sparta.livevotinganswer.repository.VoteRecordRepository;
import kr.sparta.livevotinganswer.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRecordRepository voteRecordRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;

    @Transactional
    public Long createVotes(VoteCreateRequestDto requestDto) {
        User user = userRepository.findByLoginId(requestDto.authorId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with loginId: " + requestDto.authorId()));

        //save votes
        Votes votes = Votes.builder()
                .name(requestDto.title())
                .user(user)
                .status(VoteStatus.OPEN)
                .build();
        voteRepository.save(votes);

        //save candidates
        List<Candidate> candidates = requestDto.candidates().stream()
                .map(candidateName -> Candidate.builder()
                        .name(candidateName)
                        .votes(votes)
                        .build())
                .toList();
        candidateRepository.saveAll(candidates);

        return votes.getId();
    }

    public VoteActionResponseDto performVote(Long voteId, VoteActionRequestDto requestDto) {
        User user = userRepository.findByLoginId(requestDto.voterId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with loginId: " + requestDto.voterId()));

        Votes votes = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResourceNotFoundException("Vote not found with id: " + voteId));

        if (votes.getStatus() == VoteStatus.CLOSED) {
            throw new IllegalStateException("This vote is closed.");
        }

        Candidate candidate = candidateRepository.findById(requestDto.candidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + requestDto.candidateId()));


        //save vote_record
        VoteRecord voteRecord = VoteRecord.builder()
                .user(user)
                .candidate(candidate)
                .build();
        voteRecordRepository.save(voteRecord);

        return new VoteActionResponseDto(
                votes.getId(),
                candidate.getId(),
                user.getLoginId(),
                voteRecord.getCreatedAt()
        );
    }

    public VoteCloseResponseDto closeVote(Long voteId, VoteCloseRequestDto requestDto) {
        Votes votes = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResourceNotFoundException("Vote not found with id: " + voteId));

        if (!votes.getUser().getLoginId().equals(requestDto.authorId())) {
            throw new AuthorizationException("투표를 생성한 사용자가 아니므로 종료를 할 수 없습니다.");
        }

        if (votes.getStatus() == VoteStatus.CLOSED) {
            throw new IllegalStateException("이미 종료된 투표입니다.");
        }

        votes.close();
        voteRepository.save(votes);

        return new VoteCloseResponseDto(votes.getId(), votes.getStatus().name());
    }

    @Transactional(readOnly = true)
    public List<VoteListResponseDto> getAllVotes() {
        List<Votes> allVotes = voteRepository.findAll();

        return allVotes.stream()
                .map(votes -> {
                    return new VoteListResponseDto(
                            votes.getId(),
                            votes.getName(),
                            votes.getStatus().name(),
                            votes.getUser().getNickname(),
                            votes.getUser().getLoginId(),
                            votes.getCreatedAt(),
                            List.of(), //TODO:: 프론트 코드 바뀌면 없앨 것
                            0L
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VoteDetailResponseDto getVoteDetails(Long voteId) {

        Votes votes = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResourceNotFoundException("Vote not found"));

        //투표 수 집계
        List<CandidateResponseDto> list = new ArrayList<>();
        int totalCount = 0;
        for (Candidate candidate : votes.getCandidates()) {
            list.add(new CandidateResponseDto(
                    candidate.getId(),
                    candidate.getName(),
                    (long)candidate.getVoteRecords().size()
            ));
            totalCount += candidate.getVoteRecords().size();
        }

        return new VoteDetailResponseDto(
                votes.getId(),
                votes.getName(),
                votes.getStatus().name(),
                votes.getUser().getNickname(),
                votes.getUser().getLoginId(),
                votes.getCreatedAt(),
                list,
                (long)totalCount
        );
    }

    @Transactional(readOnly = true)
    public VoteActionResponseDto getVoteRecord(Long voteId, String voterId) {
        User user = userRepository.findByLoginId(voterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with loginId: " + voterId));

        Votes votes = voteRepository.findById(voteId)
                .orElseThrow(() -> new ResourceNotFoundException("Vote not found with id: " + voteId));

        Optional<VoteRecord> voteRecordOptional = voteRecordRepository.findByUserAndCandidate_Votes(user, votes);

        return voteRecordOptional.map(voteRecord -> new VoteActionResponseDto(
                voteRecord.getCandidate().getVotes().getId(),
                voteRecord.getCandidate().getId(),
                voteRecord.getUser().getLoginId(),
                voteRecord.getCreatedAt()
        )).orElse(null);
    }

}
