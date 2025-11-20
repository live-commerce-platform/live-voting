package kr.sparta.livevotinganswer.repository;

import kr.sparta.livevotinganswer.entity.User;
import kr.sparta.livevotinganswer.entity.VoteRecord;
import kr.sparta.livevotinganswer.entity.Votes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {

    /*
      VoteRecord 테이블에서 연관관계가 있는 Candidate를 호출하고,
      또 거기서 Votes를 호출해서 조회한다.
     */
    Optional<VoteRecord> findByUserAndCandidate_Votes(User user, Votes votes);

}
