package kr.sparta.livevotinganswer.repository;

import kr.sparta.livevotinganswer.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
