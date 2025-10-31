package com.server.back.application.service;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subcribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userId, emitter);
        log.info("{} 의 새로운 emitter subcribed 생성 되었습니다.", userId);

        emitter.onCompletion(() -> {
            emitters.remove(userId);
            log.info("{} 의 emitter가 끝났습니다.", userId);
        });

        emitter.onError((e) -> {
            emitters.remove(userId);
            log.error("{} 의 emitter에 오류 발생으로 종료되었습니다. 에러 내용 : {}", userId, e);
        });

        emitter.onTimeout(() -> {
            emitters.remove(userId);
            log.error("{} 의 emitter가 실행 시간이 지나 강제 종료되었습니다.", userId);
        });

        try {
            emitter.send(SseEmitter.event().name("connect").data("Connection 설정"));
        } catch (IOException e) {
            log.error("SSE connection event에 실패했습니다. 사용자 : {}", userId);
        }

        return emitter;
    }

    public void sendNotification(Long userId, String eventName, String data) {
        SseEmitter emitter = emitters.get(userId);

        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(Map.of("message", data)));
                log.info("알림을 보냈습니다. 사용자 : {}, 이벤트 : {}, 메세지 : {}", userId, eventName, data);
            } catch (IOException e) {
                log.error("알람 보내기에 실패했습니다.  사용자 : {}, 이벤트 : {}, 메세지 : {}", userId, eventName, data);
                emitters.remove(userId);
            }

        } else {
            log.warn("{} 유저의 실행중인 SSE Emitter를 찾을 수 없습니다", userId);
        }
    }
}
