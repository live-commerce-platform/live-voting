package kr.sparta.livevotinganswer.repository;

import kr.sparta.livevotinganswer.entity.Votes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Votes, Long> {

    List<Votes> findAll();
    Optional<Votes> findById(Long voteId);

}
