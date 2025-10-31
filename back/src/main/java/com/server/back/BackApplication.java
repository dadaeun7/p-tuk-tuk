package com.server.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.session.SessionAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableCaching
@EnableRetry
@EnableScheduling
@EnableAsync
@SpringBootApplication(exclude = { SessionAutoConfiguration.class })
public class BackApplication {

	public static void main(String[] args) {
		System.out.println("### System.out.println from Spring Boot ###");

		SpringApplication.run(BackApplication.class, args);

		System.out.println("### Application Started! ###");
	}

}
