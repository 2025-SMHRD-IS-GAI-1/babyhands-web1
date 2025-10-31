package com.babyhands.frontController;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.babyhands.controller.LoginService;

@WebServlet("*.do")
public class FrontController extends HttpServlet {
	
	// FrontController : 단 한개의 Servlet을 사용하여,
	// 모든 요청과 응답을 처리하는 패턴!
	private static final long serialVersionUID = 1L;
	// POJO 클래스들을 하나로 묶어서 저장해보자
	private HashMap<String, Command> map;
    
	@Override
	public void init(ServletConfig config) throws ServletException {
		map = new HashMap<String, Command>();
		map.put("Login.do", new LoginService());
	}

	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// 1. FrontController에 들어온 요청이 어떤 요청인지 파악!
		String path = request.getContextPath();
		
		// 실행되는 uri 주소 가져오기
		String uri = request.getRequestURI();
		
		String finalUri = uri.substring(path.length() + 1);
		
		String moveUrl = "";
		
		Command com = null;
		
		// 1. 요청 객체에 대한 인코딩 작업!
		request.setCharacterEncoding("UTF-8");
		
		// 요청별에 따른 기능 연결!
		if(finalUri.contains("Go")) {
			// ex) Gomain.do
			// main.jsp 파일로 forward 방식 이동
			// 최종적으로 이동해야하는 경로를 만들어주는 작업
			moveUrl = finalUri.substring(2).replaceAll("do", "jsp");
		} else {
			com = map.get(finalUri);
			moveUrl = com.execute(request, response);
		}
		
		// moveUrl이 null이면(이미 Service에서 응답 끝낸 경우) 더 진행하지 않음
		if (moveUrl == null) {
		    return;
		}

		// 비동기(JSON 문자열) 응답
		if (moveUrl.startsWith("fetch:/") || moveUrl.startsWith("axios:/")) {
		    response.setContentType("application/json; charset=UTF-8");
		    try (PrintWriter out = response.getWriter()) {
		        // "fetch:/" == 7글자, 뒤는 순수 JSON 텍스트라고 가정
		        out.print(moveUrl.substring(7));
		    }
		    return;
		}

		// 리다이렉트: 컨텍스트 경로 + "/Gomain.do" 형태로
		if (moveUrl.startsWith("redirect:/")) {
		    String ctx = request.getContextPath();    // 예: /ExMessageSystem
		    // "redirect:/"는 9글자 → substring(9) 결과는 "/Gomain.do"
		    response.sendRedirect(ctx + moveUrl.substring(9));
		    return;
		}

		// 그 외엔 JSP forward (WEB-INF 아래로 안전하게)
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/views/" + moveUrl);
		rd.forward(request, response);
		
	}

}
