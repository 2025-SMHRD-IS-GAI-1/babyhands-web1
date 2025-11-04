package com.babyhands.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.babyhands.dao.SignLanguageDAO;
import com.babyhands.dto.QuestionDTO;
import com.babyhands.frontController.Command;
import com.google.gson.Gson;

public class GetQuestionListService implements Command {
	
	private final Gson gson = new Gson();
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession();
		
		if (session == null || session.getAttribute("loginVO") == null) {
            return "redirect:/Gologin.do";
        }
		
		SignLanguageDAO sldao = new SignLanguageDAO();
		
		List<QuestionDTO> questionList = sldao.getQuestionList();
		
		Random random = new Random();
		
		int n = questionList.size();
		
		for(int i = 0; i < questionList.size(); i++) {
			String correctAnswer = questionList.get(i).getMeaning();
			List<String> answers = new ArrayList<>();
			answers.add(correctAnswer);
			
			while(answers.size() < 4) {
				int ranNum = random.nextInt(n);
				if (ranNum == i) continue;
				String temp = questionList.get(ranNum).getMeaning();
				if(!answers.contains(temp)) {
					answers.add(temp);
				}
			}
			Collections.shuffle(answers);
			questionList.get(i).setAnswers(answers);
		}
		
		Map<String, Object> payload = new HashMap<>();
		
		if(questionList != null) {
			// 출석 db에 insert
            payload.put("ok", true);
            payload.put("questionList", questionList);
		} else {
			payload.put("ok", false);
            payload.put("message", "문제 리스트 불러오기 실패");
		}
		
		return "fetch:/" + gson.toJson(payload);
	}

}
