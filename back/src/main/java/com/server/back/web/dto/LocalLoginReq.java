package com.server.back.web.dto;

public record LocalLoginReq(String email, String password, boolean autoCheck) {

}
