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

public class KakaoOAuthCallbackService implements Command {
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		// 카카오에서 전달받은 인증 코드
		String code = request.getParameter("code");
		String error = request.getParameter("error");
		
		HttpSession session = request.getSession();
		
		// 에러 처리
		if (error != null) {
			request.setAttribute("loginSuccess", false);
			request.setAttribute("error", error);
			return "kakaoCallback.jsp";
		}
		
		if (code == null || code.trim().isEmpty()) {
			request.setAttribute("loginSuccess", false);
			request.setAttribute("error", "카카오 인증 코드가 없습니다.");
			return "kakaoCallback.jsp";
		}
		
		try {
			// JNDI에서 카카오 클라이언트 정보 가져오기
			Context env = (Context) new InitialContext().lookup("java:comp/env");
			String clientId = (String) env.lookup("oauth.kakao.rest_api_key");
			String redirectUri = request.getRequestURL().toString();
			
			// 인증 코드를 액세스 토큰으로 교환
			String accessToken = getKakaoAccessToken(code, clientId,  redirectUri);
			
			if (accessToken == null) {
				request.setAttribute("loginSuccess", false);
				request.setAttribute("error", "카카오 액세스 토큰을 가져올 수 없습니다.");
				return "kakaoCallback.jsp";
			}
			
			// 카카오 API로 사용자 정보 가져오기
			String userInfoJson = getKakaoUserInfo(accessToken);
			
			if (userInfoJson == null) {
				request.setAttribute("loginSuccess", false);
				request.setAttribute("error", "카카오 사용자 정보를 가져올 수 없습니다.");
				return "kakaoCallback.jsp";
			}
			
			// JSON 파싱
			JsonObject userInfo = JsonParser.parseString(userInfoJson).getAsJsonObject();
			JsonObject kakaoAccount = userInfo.getAsJsonObject("kakao_account");
			
			
			// 카카오 ID (필요시 사용)
			// 카카오 API에서 기본으로 카카오계정을 권한 없음 처리함 하려면 비즈 앱 으로 신청 해야함
			// 카카오 ID로 일단 이메일 형식으로 만듬
			String email = userInfo.get("id").getAsString() + "@kakao.com";
			String nickname = null;
			
			if (kakaoAccount.has("profile") && !kakaoAccount.get("profile").isJsonNull()) {
				JsonObject profile = kakaoAccount.getAsJsonObject("profile");
				if (profile.has("nickname") && !profile.get("nickname").isJsonNull()) {
					nickname = profile.get("nickname").getAsString();
				}
			}
			
			// 닉네임이 없으면 기본값 사용
			if (nickname == null || nickname.trim().isEmpty()) {
				nickname = "카카오사용자";
			}
			
			// 이메일로 회원 조회 (이메일이 있는 경우)
			MemberDAO mdao = new MemberDAO();
			MemberVO existingMember = null;
			
			MemberVO searchVO = MemberVO.builder()
					.email(email)
					.build();
			existingMember = mdao.findByEmail(searchVO);
			
			MemberVO loginVO;
			
			if (existingMember == null) {
				// 신규 회원 - 자동 회원가입
				String memberId = "kakao_" + java.util.UUID.randomUUID().toString().replace("-", "");
				
				// 닉네임 생성 (중복 체크)
				String finalNickname = nickname + "_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 10000);
				finalNickname = finalNickname.length() > 20 ? finalNickname.substring(0, 20) : finalNickname;
				
				// 중복되지 않는 닉네임이 나올 때까지 반복
				while (mdao.nickNameCheck(finalNickname) != null) {
					finalNickname = nickname + "_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 10000);
					finalNickname = finalNickname.length() > 20 ? finalNickname.substring(0, 20) : finalNickname;
				}
				
				String pw = org.mindrot.jbcrypt.BCrypt.hashpw("KAKAO_OAUTH", org.mindrot.jbcrypt.BCrypt.gensalt(10));
				
				loginVO = MemberVO.builder()
						.memberId(memberId)
						.pw(pw)
						.nickname(finalNickname)
						.email(email)
						.build();
				
				int joinResult = mdao.join(loginVO);
				
				if (joinResult > 0) {
					// 회원가입 성공
					loginVO = MemberVO.builder()
							.memberId(memberId)
							.nickname(finalNickname)
							.build();
				} else {
					request.setAttribute("loginSuccess", false);
					request.setAttribute("error", "회원가입에 실패했습니다.");
					return "kakaoCallback.jsp";
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
			return "kakaoCallback.jsp";
			
		} catch (Exception e) {
			e.printStackTrace();
			request.setAttribute("loginSuccess", false);
			request.setAttribute("error", "카카오 로그인 처리 중 오류가 발생했습니다.");
			return "kakaoCallback.jsp";
		}
	}
	
	// 카카오 인증 코드를 액세스 토큰으로 교환
	private String getKakaoAccessToken(String code, String clientId, String redirectUri) {
		try {
			URL url = new URL("https://kauth.kakao.com/oauth/token");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			conn.setDoOutput(true);
			
			// POST 데이터 작성
			String postData = "grant_type=authorization_code" +
					"&client_id=" + clientId +
					"&redirect_uri=" + redirectUri +
					"&code=" + code;
			
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
	
	// 카카오 API로 사용자 정보 가져오기
	private String getKakaoUserInfo(String accessToken) {
		try {
			URL url = new URL("https://kapi.kakao.com/v2/user/me");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
			
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

