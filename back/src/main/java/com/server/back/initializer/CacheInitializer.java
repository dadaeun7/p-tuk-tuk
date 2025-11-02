package com.server.back.initializer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.server.back.domain.order.service.cache.ItemKeywordCacheService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CacheInitializer implements CommandLineRunner {

    private final ItemKeywordCacheService itemKeywordCacheService;

    @Override
    public void run(String... arsg) throws Exception {
        log.info("##### ItemToKeyword 의 Cache를 세팅합니다. ####");

        itemKeywordCacheService.initJvmItemKeywordCache();

        log.info("##### ItemToKeyword 의 Cache 세팅이 완료되었습니다. ####");
    }

}
