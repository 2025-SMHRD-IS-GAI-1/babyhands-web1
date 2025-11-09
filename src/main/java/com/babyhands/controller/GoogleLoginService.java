package com.babyhands.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.mindrot.jbcrypt.BCrypt;

import com.babyhands.dao.AttendanceDAO;
import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class GoogleLoginService implements Command {
	
	private final Gson gson = new Gson();
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		// 구글 액세스 토큰 받기
		String accessToken = request.getParameter("accessToken");
		
		Map<String, Object> payload = new HashMap<>();
		HttpSession session = request.getSession();
		
		if (accessToken == null || accessToken.trim().isEmpty()) {
			payload.put("ok", false);
			payload.put("message", "구글 인증 토큰이 없습니다.");
			return "fetch:/" + gson.toJson(payload);
		}
		
		try {
			// 구글 API로 사용자 정보 가져오기
			String userInfoJson = getGoogleUserInfo(accessToken);
			
			if (userInfoJson == null) {
				payload.put("ok", false);
				payload.put("message", "구글 사용자 정보를 가져올 수 없습니다.");
				return "fetch:/" + gson.toJson(payload);
			}
			
			// JSON 파싱
			JsonObject userInfo = JsonParser.parseString(userInfoJson).getAsJsonObject();
			String email = userInfo.get("email").getAsString();
			String name = userInfo.has("name") ? userInfo.get("name").getAsString() : email.split("@")[0];
			String googleId = userInfo.get("id").getAsString();
			
			// 이메일로 회원 조회
			MemberDAO mdao = new MemberDAO();
			MemberVO searchVO = MemberVO.builder()
					.email(email)
					.build();
			
			MemberVO existingMember = mdao.findByEmail(searchVO);
			
			MemberVO loginVO;
			
			if (existingMember == null) {
				// 신규 회원 - 자동 회원가입
				// 구글 ID를 memberId로 사용 (고유성 보장)
				
				String memberId = "google_" + java.util.UUID.randomUUID().toString().replace("-", "");

				// 닉네임 생성 (이메일 앞부분 또는 이름 사용)
				String nickname = name + "_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 10000);
				nickname = nickname.length() > 20 ? nickname.substring(0, 20) : nickname;
				
				// 중복되지 않는 닉네임이 나올 때까지 반복
				while (mdao.nickNameCheck(nickname) != null) {
					// 타임스탬프 + 랜덤 숫자로 고유성 보장
					nickname = name + "_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 10000);
					nickname = nickname.length() > 20 ? nickname.substring(0, 20) : nickname;
				}
				
				String pw = BCrypt.hashpw("GOOGLE_OAUTH", BCrypt.gensalt(10));
				
				loginVO = MemberVO.builder()
						.memberId(memberId)
						.pw(pw) // 구글 로그인은 비밀번호 불필요
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
					payload.put("ok", false);
					payload.put("message", "회원가입에 실패했습니다.");
					return "fetch:/" + gson.toJson(payload);
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
			payload.put("ok", true);
			payload.put("redirect", request.getContextPath() + "/Gomain.do");
			
		} catch (Exception e) {
			e.printStackTrace();
			payload.put("ok", false);
			payload.put("message", "구글 로그인 처리 중 오류가 발생했습니다.");
		}
		
		return "fetch:/" + gson.toJson(payload);
	}
	
	// 구글 API로 사용자 정보 가져오기
	private String getGoogleUserInfo(String accessToken) {
		try {
			URL url = new URL("https://www.googleapis.com/oauth2/v2/userinfo");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			
			int responseCode = conn.getResponseCode();
			if (responseCode == HttpURLConnection.HTTP_OK) {
				BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
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