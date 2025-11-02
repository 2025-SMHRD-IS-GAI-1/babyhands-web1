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
	public String idCheck(String memberId) {
		SqlSession sqlSession = factory.openSession();
		
		String result = sqlSession.selectOne("idCheck", memberId);
		
		sqlSession.close();
		
		return result;
	}
	
	// 닉네임 중복 체크
	public String nickNameCheck(String nickname) {
		SqlSession sqlSession = factory.openSession();
		
		String result = sqlSession.selectOne("nicknameCheck", nickname);
		
		sqlSession.close();
		
		return result;
	}
	
	// 이메일 중복 체크
	public String emailCheck(String email) {
		SqlSession sqlSession = factory.openSession();
		
		String result = sqlSession.selectOne("emailCheck", email);
		
		sqlSession.close();
		
		return result;
	}
	
	// 회원 가입
	public int join(MemberVO mvo) {
		SqlSession sqlSession = factory.openSession();
		
		int row = sqlSession.insert("join", mvo);
		
		sqlSession.commit(); // 커밋 필수
		
		sqlSession.close();
		
		return row;
	}
	
	// 회원 수정 전 로그인 회원 정보 가져오기
	public MemberVO selectById(String memberId) {
		SqlSession sqlSession = factory.openSession();
		
		MemberVO member = sqlSession.selectOne("selectById", memberId);
		
		sqlSession.close();
		
		return member;
	}
	
	// 회원 수정 페이지에서 닉네임 중복 체크
	public String updateNickCheck(MemberVO mvo) {
		SqlSession sqlSession = factory.openSession();
		
		String result = sqlSession.selectOne("updateNickCheck", mvo);
		
		sqlSession.close();
		
		return result;
	}
	
	// 회원 수정 페이지에서 이메일 중복 체크
	public String updateEmailCheck(MemberVO mvo) {
		SqlSession sqlSession = factory.openSession();
		
		String result = sqlSession.selectOne("updateEmailCheck", mvo);
		
		sqlSession.close();
		
		return result;
	}
	
	// 회원 수정
	public int update(MemberVO mvo) {
		SqlSession sqlSession = factory.openSession();
		
		int row = sqlSession.update("update", mvo);
		
		sqlSession.commit(); // 커밋 필수
		
		sqlSession.close();
		
		return row;
	}
	
	// 회원 탈퇴
	public int delete(String memberId) {
		SqlSession sqlSession = factory.openSession();
		
		int row = sqlSession.delete("delete", memberId);
		
		sqlSession.commit(); // 커밋 필수
		
		sqlSession.close();
		
		return row;
	}
	
	// 아이디 찾기 : 이메일로 회원 아이디 찾기
	public String findIdByEmail(String email) {
		SqlSession sqlSession = factory.openSession();
		
		String memberId = sqlSession.selectOne("findIdByEmail", email);
		
		sqlSession.close();
		
		return memberId;
	}
	
	// 비밀번호 찾기 : 아이디와 이메일로 회원 비밀번호 찾기
	public String findPw(MemberVO mvo) {
		SqlSession sqlSession = factory.openSession();
		
		String pw = sqlSession.selectOne("findPw", mvo);
		
		sqlSession.close();
		
		return pw;
	}

	

	

}
