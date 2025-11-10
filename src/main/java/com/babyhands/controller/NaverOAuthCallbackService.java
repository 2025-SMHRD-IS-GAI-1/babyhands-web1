package com.babyhands.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.AttendanceDAO;
import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class NaverOAuthCallbackService implements Command {
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		// 네이버에서 전달받은 인증 코드와 state
		String code = request.getParameter("code");
		String state = request.getParameter("state");
		String error = request.getParameter("error");
		
		HttpSession session = request.getSession();
		
		// 에러 처리
		if (error != null) {
			request.setAttribute("loginSuccess", false);
			request.setAttribute("error", error);
			return "naverCallback.jsp";
		}
		
		if (code == null || code.trim().isEmpty()) {
			request.setAttribute("loginSuccess", false);
			request.setAttribute("error", "네이버 인증 코드가 없습니다.");
			return "naverCallback.jsp";
		}
		
		// State 검증 (CSRF 방지)
		String sessionState = (String) session.getAttribute("naver_oauth_state");
		if (sessionState == null || !sessionState.equals(state)) {
			request.setAttribute("loginSuccess", false);
			request.setAttribute("error", "인증 요청이 유효하지 않습니다. 다시 시도해주세요.");
			session.removeAttribute("naver_oauth_state"); // 검증 후 세션에서 제거
			return "naverCallback.jsp";
		}
		
		// 검증 성공 후 세션에서 state 제거 (일회용)
		session.removeAttribute("naver_oauth_state");
		
		try {
			// JNDI에서 네이버 클라이언트 정보 가져오기
			Context env = (Context) new InitialContext().lookup("java:comp/env");
			String clientId = (String) env.lookup("naver.client.id");
			String clientSecret = (String) env.lookup("naver.client.secret");
			String redirectUri = request.getRequestURL().toString();
			
			// 인증 코드를 액세스 토큰으로 교환
			String accessToken = getNaverAccessToken(code, clientId, clientSecret, redirectUri, state);
			
			if (accessToken == null) {
				request.setAttribute("loginSuccess", false);
				request.setAttribute("error", "네이버 액세스 토큰을 가져올 수 없습니다.");
				return "naverCallback.jsp";
			}
			
			// 네이버 API로 사용자 정보 가져오기
			String userInfoJson = getNaverUserInfo(accessToken);
			
			if (userInfoJson == null) {
				request.setAttribute("loginSuccess", false);
				request.setAttribute("error", "네이버 사용자 정보를 가져올 수 없습니다.");
				return "naverCallback.jsp";
			}
			
			// JSON 파싱
			JsonObject userInfo = JsonParser.parseString(userInfoJson).getAsJsonObject();
			JsonObject responseObj = userInfo.getAsJsonObject("response");
			
			String email = responseObj.get("email").getAsString();
			String name = responseObj.has("name") ? responseObj.get("name").getAsString() : email.split("@")[0];
			// String naverId = responseObj.get("id").getAsString(); // 필요시 사용
			
			// 이메일로 회원 조회
			MemberDAO mdao = new MemberDAO();
			MemberVO searchVO = MemberVO.builder()
					.email(email)
					.build();
			
			MemberVO existingMember = mdao.findByEmail(searchVO);
			
			MemberVO loginVO;
			
			if (existingMember == null) {
				// 신규 회원 - 자동 회원가입
				String memberId = "naver_" + java.util.UUID.randomUUID().toString().replace("-", "");
				
				// 닉네임 생성
				String nickname = name + "_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 10000);
				nickname = nickname.length() > 20 ? nickname.substring(0, 20) : nickname;
				
				// 중복되지 않는 닉네임이 나올 때까지 반복
				while (mdao.nickNameCheck(nickname) != null) {
					nickname = name + "_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 10000);
					nickname = nickname.length() > 20 ? nickname.substring(0, 20) : nickname;
				}
				
				String pw = org.mindrot.jbcrypt.BCrypt.hashpw("NAVER_OAUTH", org.mindrot.jbcrypt.BCrypt.gensalt(10));
				
				loginVO = MemberVO.builder()
						.memberId(memberId)
						.pw(pw)
						.nickname(nickname)
						.email(email)
						.build();
				
				int joinResult = mdao.join(loginVO);
				
				if (joinResult > 0) {
					// 회원가입 성공
					loginVO = MemberVO.builder()
							.memberId(memberId)
							.nickname(nickname)
							.build();
				} else {
					request.setAttribute("loginSuccess", false);
					request.setAttribute("error", "회원가입에 실패했습니다.");
					return "naverCallback.jsp";
				}
			} else {
				// 기존 회원 - 로그인 처리
				loginVO = MemberVO.builder()
						.memberId(existingMember.getMemberId())
						.nickname(existingMember.getNickname())
						.build();
			}
			
			// 출석 처리
			AttendanceDAO adao = new AttendanceDAO();
			adao.attendance(loginVO.getMemberId());
			
			// 세션에 로그인 정보 저장
			session.setAttribute("loginVO", loginVO);
			
			// 콜백 페이지로 forward (팝업에서 부모 창에 메시지 전송)
			request.setAttribute("loginSuccess", true);
			request.setAttribute("redirectUrl", request.getContextPath() + "/Gomain.do");
			return "naverCallback.jsp";
			
		} catch (Exception e) {
			e.printStackTrace();
			request.setAttribute("loginSuccess", false);
			request.setAttribute("error", "네이버 로그인 처리 중 오류가 발생했습니다.");
			return "naverCallback.jsp";
		}
	}
	
	// 네이버 인증 코드를 액세스 토큰으로 교환
	private String getNaverAccessToken(String code, String clientId, String clientSecret, String redirectUri, String state) {
		try {
			URL url = new URL("https://nid.naver.com/oauth2.0/token");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			conn.setDoOutput(true);
			
			// POST 데이터 작성
			String postData = "grant_type=authorization_code" +
					"&client_id=" + clientId +
					"&client_secret=" + clientSecret +
					"&code=" + code +
					"&state=" + state;
			
			OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream(), StandardCharsets.UTF_8);
			writer.write(postData);
			writer.flush();
			writer.close();
			
			int responseCode = conn.getResponseCode();
			if (responseCode == HttpURLConnection.HTTP_OK) {
				BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
				StringBuilder response = new StringBuilder();
				String inputLine;
				
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}
				in.close();
				
				// JSON 파싱하여 access_token 추출
				JsonObject jsonResponse = JsonParser.parseString(response.toString()).getAsJsonObject();
				return jsonResponse.get("access_token").getAsString();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	// 네이버 API로 사용자 정보 가져오기
	private String getNaverUserInfo(String accessToken) {
		try {
			URL url = new URL("https://openapi.naver.com/v1/nid/me");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			
			int responseCode = conn.getResponseCode();
			if (responseCode == HttpURLConnection.HTTP_OK) {
				BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
				StringBuilder response = new StringBuilder();
				String inputLine;
				
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}
				in.close();
				
				return response.toString();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}

