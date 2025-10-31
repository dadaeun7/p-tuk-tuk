package com.server.back.web.dto;

import java.util.List;

public record ModifyDisposalReq(
        List<String> orderNumberList,
        boolean isCheck) {
}
