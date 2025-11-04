package com.babyhands.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.SlTestDAO;
import com.babyhands.frontController.Command;
import com.babyhands.vo.MemberVO;
import com.babyhands.vo.SlTestVO;
import com.google.gson.Gson;

public class SubmitTestService implements Command {

	private final Gson gson = new Gson();

	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {

		// 2. 요청 객체로 부터 데이터 꺼내오기
		HttpSession session = request.getSession();
		MemberVO loginVO = (MemberVO) session.getAttribute("loginVO");
		String memberId = loginVO.getMemberId();
		
		String ids = request.getParameter("ids");
		String answers = request.getParameter("answers");
		
		List<Integer> idList = new ArrayList<>();
		List<String> answerList = new ArrayList<>();
		
		for(String id : ids.split(",")) {
			idList.add(Integer.parseInt(id));
		}
		
		for(String answer : answers.split(",")) {
			answerList.add(answer);
		}
		
		// 3. DB에 해당하는 내용이 전달되도록 작업! => DAO 클래스

		SlTestDAO testDao = new SlTestDAO();
		
		// db insert 전에 group 가져옴
		int group = testDao.getGroup();
		
		int row = 0;
		
		List<SlTestVO> list = new ArrayList<>();
		for (int i = 0; i < 5; i++) {
			SlTestVO testVo = SlTestVO.builder()
					.slTestGroup(group)
					.chooseAnswer(answerList.get(i))
					.memberId(memberId)
					.slId(idList.get(i))
					.build();
			list.add(testVo);
			// DB INSERT
			int result = testDao.insert(testVo);
			row += result;
		}
		
		Map<String, Object> payload = new HashMap<>();

		if (row >= 5) {
			payload.put("ok", true);
			payload.put("redirect", request.getContextPath() + "/GoLastResult.do");
		} else {
			payload.put("ok", false);
			payload.put("message", "테스트 값을 저장을 못했거나 누락되었습니다.");
		}

		return "fetch:/" + gson.toJson(payload);
	}

}
