package kr.sparta.livevoting.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User {

    //TODO:: 본인이 작성한 컬럼명과 특성에 맞게 작성해보세요.

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   /* 예시
   @Column(nullable = false, length = 20)
    private String loginId;
   */

}
