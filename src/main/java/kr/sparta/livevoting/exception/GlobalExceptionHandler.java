package kr.sparta.livevoting.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllUncaughtException(Exception ex) {
        return new ResponseEntity<>("예상치 못한 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
