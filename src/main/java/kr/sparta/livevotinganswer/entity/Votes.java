package kr.sparta.livevotinganswer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "votes")
public class Votes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private VoteStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime closedAt;

    @BatchSize(size = 50)
    @OneToMany(mappedBy = "votes", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidate> candidates = new ArrayList<>();

    public void close() {
        this.status = VoteStatus.CLOSED;
        this.closedAt = LocalDateTime.now();
    }
}
