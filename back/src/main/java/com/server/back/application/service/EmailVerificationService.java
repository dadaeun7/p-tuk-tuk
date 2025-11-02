package com.server.back.application.service;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import com.server.back.domain.user.event.EmailConfirmEvent;
import com.server.back.domain.user.exception.PasswordToJoinError;
import com.server.back.domain.verification.exception.CodeNotEquals;
import com.server.back.domain.verification.generator.EmailAuth6Generator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final SendGrid sendGrid;
    // private final JavaMailSender javaMailSender;

    @Qualifier("stringRedisTemplate")
    private final StringRedisTemplate redis;

    private final EmailAuth6Generator emailAuth6Generator;

    private final String codeKey(String email) {
        return "email:verify:" + email;
    }

    private final String triesKey(String email) {
        return "email:tries:" + email;
    }

    private final String senderEmail = "dadaeun7@gmail.com";

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public CompletableFuture<Void> sendCode(EmailConfirmEvent event) {

        try {

            // MimeMessage message = javaMailSender.createMimeMessage();
            // MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String code = emailAuth6Generator.generate();
            Duration validTime = emailAuth6Generator.ttl();

            redis.opsForValue().set(codeKey(event.email()), code, validTime);

            String emailForm = """
                        <!DOCTYPE html>
                        <html lang="ko">
                        <head>
                        <meta charset="UTF-8" />
                        <title>tuktuk 계정 이메일 인증</title>
                        </head>
                        <body style="margin:0; padding:0; background-color:#f9f9f9; font-family: Arial, '맑은 고딕', sans-serif;">
                        <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding:20px 0;">
                            <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
                                <tr>
                                    <td style="background-color:#2563eb; padding:16px 24px; color:#ffffff; font-size:20px; font-weight:bold;">
                                    tuktuk Account
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:32px 24px; color:#333333; font-size:15px; line-height:1.6;">
                                    <p style="font-size:18px; font-weight:bold; margin-bottom:16px;">이메일을 인증해주세요.</p>
                                    <p style="margin:0 0 16px;">안녕하세요. <strong>tuktuk</strong>입니다.<br>
                                    이메일 인증을 위해 아래 인증코드를 회원가입 페이지에 입력해주세요.</p>
                                    <div style="margin:24px 0; padding:16px; background-color:#f3f4f6; text-align:center; font-size:20px; font-weight:bold; letter-spacing:2px; border-radius:4px;">
                                        <span style="color:#2563eb;">%s</span>
                                    </div>
                                    <p>감사합니다.</p><p style="font-size:12px; color:#888888; margin:0 0 2px;">툭툭 계정팀 드림.</p>
                                    <p style="font-size:12px; color:#888888; line-height:1.4; border-top:1px solid #e5e7eb; padding-top:16px;">
                                        참고: 이 메일은 발신 전용이므로 회신하실 수 없습니다.
                                    </p>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </table>
                        </body>
                        </html>
                    """
                    .formatted(code);

            // helper.setFrom("dadaeun7@gmail.com");
            // helper.setTo(event.email());
            // helper.setSubject("[툭툭] 이메일 인증 코드입니다.");
            // helper.setText(emailForm, true);

            // javaMailSender.send(message);

            Email from = new Email(senderEmail);
            Email to = new Email(event.email());
            Content content = new Content("text/html", emailForm);

            Mail mail = new Mail();
            mail.setFrom(from);
            mail.setSubject("[툭툭] 이메일 인증 코드입니다.");
            mail.addContent(content);

            Personalization personalization = new Personalization();
            personalization.addTo(to);

            mail.addPersonalization(personalization);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() < 200 || response.getStatusCode() >= 300) {
                log.info("SendGrid 발송실패, Code: " + response.getStatusCode());
                throw new RuntimeException("SendGrid API 발송 실패");
            }

            return CompletableFuture.completedFuture(null);

        } catch (IOException | RuntimeException e) {
            // throw new IllegalStateException("메일 발송 실패", e);
            return CompletableFuture.failedFuture(e);
        }

    }

    public void verifyCode(String email, String inCode) {

        String key = codeKey(email);
        String saved = redis.opsForValue().get(key);

        if (saved == null)
            throw new CodeNotEquals("요청 된 인증이 없습니다.");

        if (saved.equals(inCode)) {

            redis.delete(key);
            redis.delete(triesKey(email));

        } else {

            Long tries = redis.opsForValue().increment(triesKey(email));

            if (tries != null && tries == 1L) {
                redis.expire(triesKey(email), Duration.ofMinutes(10));
            }

            if (tries != null && tries > 10) {
                throw new PasswordToJoinError("인증 시도 횟수를 초과하였습니다.");
            }

            throw new CodeNotEquals("인증 코드가 일치하지 않습니다.");
        }

    }

}
