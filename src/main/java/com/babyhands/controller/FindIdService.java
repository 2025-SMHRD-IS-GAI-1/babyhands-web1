package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.util.MailSender;
import com.google.gson.Gson;


public class FindIdService implements Command {

	private final Gson gson = new Gson();

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {

		// 2. 요청 객체로 부터 데이터 꺼내오기
		String email = request.getParameter("email");

		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스

		MemberDAO dao = new MemberDAO();
		String memberId = dao.findIdByEmail(email);
		Map<String, Object> payload = new HashMap<>();

		if (memberId != null) {
			String to = email;
			String subject = "[꼬마손] 아이디 안내";
	        String html = """
	            <div style="font-family:Arial,'Noto Sans KR',sans-serif;font-size:14px;color:#222">
	              <h2 style="margin:0 0 12px">아이디 안내</h2>
	              <p>요청하신 아이디는 <b>%s</b> 입니다.</p>
	              <p style="color:#666">본 메일은 발신 전용입니다.</p>
	            </div>
	        """.formatted(memberId);
	        
	        try {
	            // from은 Mailer가 JNDI/환경설정 기반으로 자동 결정(Gmail 인증 계정 사용)
	        	MailSender.sendHtml(email, subject, html);
	            payload.put("ok", true);
	        } catch (MessagingException e) {
	            e.printStackTrace();
	            payload.put("ok", false);
	        }
		} else {
			payload.put("ok", false);
		}

		return "fetch:/" + gson.toJson(payload);
	}

}
