package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.vo.MemberVO;
import com.babyhands.config.MysqlSessionManager;

public class MemberDAO {
	// DB에 연결하기 위한 기본적인 작업을(SqlSessionFactory, sqlSession)을 
	// 수행할수 있는 클래스!
	// WEB_MEMBER 테이블을 사용하여 작업할수 있는 모든 기능을
	// => WEB_MEMBER 테이블의 작업!
	// : 회원 가입, 로그인, 회원정보 수정, 회원 탈퇴, 회원의 목록 조회, ...
	
	// 필드영역
	// DBCP를 만드는 공장을 꺼내오기
	private SqlSessionFactory factory = MysqlSessionManager.getFactory();
	
	// 로그인 기능
	public MemberVO login(MemberVO mvo) {
		
		SqlSession sqlSession = factory.openSession();
				
		MemberVO loginVO = sqlSession.selectOne("login", mvo);
		
		sqlSession.close();
		
		return loginVO;
	}
	
	// 아이디 중복 체크
	public MemberVO idCheck(String memberId) {
		SqlSession sqlSession = factory.openSession();
		
		MemberVO loginVO = sqlSession.selectOne("idCheck", memberId);
		
		sqlSession.close();
		
		return loginVO;
	}
	
	// 닉네임 중복 체크
	public MemberVO nickNameCheck(String nickname) {
		SqlSession sqlSession = factory.openSession();
		
		MemberVO loginVO = sqlSession.selectOne("nicknameCheck", nickname);
		
		sqlSession.close();
		
		return loginVO;
	}
	
	// 회원 가입
	public int join(MemberVO mvo) {
		SqlSession sqlSession = factory.openSession();
		
		int row = sqlSession.insert("join", mvo);
		
		sqlSession.commit(); // 커밋 필수
		
		sqlSession.close();
		
		return row;
	}

}
