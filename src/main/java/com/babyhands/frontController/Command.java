package com.babyhands.frontController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface Command {
	// Command의 역활!
	// 요청되는 기능마다 수행해야 하는 내용은 달라지지만!
	// 해당 기능들을 수행할수 있도록 시작을 알려주는 메소드 (공통의 이름으로 공통의 구조를 가지고!)
	// 기능 ==> Servlet에서 수행되던 service 메소드의 기능!!
	// 필수적으로 필요한 request, response 객체 필요!
	
	public String execute(HttpServletRequest request, HttpServletResponse response); // 추상적인 메소드
	// => Servlet의 Service() 메소드 처럼 모든 요청을 실행할수 있는 우리만의 패턴!
}
