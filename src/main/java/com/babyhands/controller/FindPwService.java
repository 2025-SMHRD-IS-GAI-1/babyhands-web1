package com.babyhands.controller;

import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.babyhands.dao.MemberDAO;
import com.babyhands.frontController.Command;
import com.babyhands.util.MailSender;
import com.babyhands.vo.MemberVO;
import com.google.gson.Gson;

public class FindPwService implements Command {

	private final Gson gson = new Gson();

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {

		// 2. 요청 객체로 부터 데이터 꺼내오기
		String memberId = request.getParameter("id");
		String email = request.getParameter("email");
		
		MemberVO mvo = MemberVO.builder()
				.memberId(memberId)
				.email(email)
				.build();
		
		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스

		MemberDAO dao = new MemberDAO();
		MemberVO memberVO = dao.emailExist(mvo);
		Map<String, Object> payload = new HashMap<>();

		if (memberVO != null) {
			String to = email;
			String url = "";
			String subject = "[꼬마손] 비밀번호 안내";
	        String html = """
	            <div style="font-family:Arial,'Noto Sans KR',sans-serif;font-size:14px;color:#222">
	              <h2 style="margin:0 0 12px">비밀번호 재설정 안내</h2>
	              <p>보안을 위해 새 비밀번호는 메일로 전달하지 않습니다. 아래 버튼을 눌러 비밀번호를 직접 재설정해주세요.</p>
	              <p style="margin:16px 0">
	        		      <a href="%s"
	        		      style="display:inline-block;padding:10px 16px;background:#4ea3ff;color:#fff;
	        		      text-decoration:none;border-radius:8px">비밀번호 재설정</a>
	        	  </p>
	              <p style="color:#666">본 메일은 발신 전용입니다. 요청하지 않은 메일이라면 무시해주세요.</p>
	            </div>
	        """.formatted("http://localhost:8090" + request.getContextPath() + "/GopwUpdate.do?memberId=" + memberId);
	        
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
