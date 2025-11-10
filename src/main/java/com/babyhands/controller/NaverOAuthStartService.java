package com.babyhands.controller;

import java.security.SecureRandom;
import java.util.Base64;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.frontController.Command;

public class NaverOAuthStartService implements Command {
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		try {
			HttpSession session = request.getSession();
			
			// CSRF 방지를 위한 state 생성
			String state = generateState();
			
			// 세션에 state 저장 (콜백에서 검증용)
			session.setAttribute("naver_oauth_state", state);
			
			// JNDI에서 네이버 클라이언트 정보 가져오기
			Context env = (Context) new InitialContext().lookup("java:comp/env");
			String clientId = (String) env.lookup("naver.client.id");
			String redirectUri = request.getRequestURL().toString().replace("NaverOAuthStart.do", "NaverOAuthCallback.do");
			
			// 네이버 로그인 인증 URL 생성
			String naverAuthUrl = "https://nid.naver.com/oauth2.0/authorize?" +
					"response_type=code" +
					"&client_id=" + java.net.URLEncoder.encode(clientId, "UTF-8") +
					"&redirect_uri=" + java.net.URLEncoder.encode(redirectUri, "UTF-8") +
					"&state=" + java.net.URLEncoder.encode(state, "UTF-8");
			
			// 네이버 인증 페이지로 리다이렉트
			return "redirect:" + naverAuthUrl;
			
		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/login.jsp?error=네이버 로그인 초기화 실패";
		}
	}
	
	// 보안을 위한 랜덤 state 생성
	private String generateState() {
		SecureRandom random = new SecureRandom();
		byte[] bytes = new byte[32];
		random.nextBytes(bytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}
}

