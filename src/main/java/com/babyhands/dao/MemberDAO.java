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

}
