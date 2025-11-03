package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;
import com.babyhands.dto.AttendanceDTO;

public class AttendanceDAO {

	// 필드영역
	// DBCP를 만드는 공장을 꺼내오기
	private SqlSessionFactory factory = MysqlSessionManager.getFactory();

	// 출석기능
	public int attendance(String memberId) {

		SqlSession sqlSession = factory.openSession();

		int row = sqlSession.insert("attendance", memberId);
		
		sqlSession.commit(); // 커밋 필수

		sqlSession.close();

		return row;
		
	}
	
    // 출석한 날짜 리스트 불러오기 (달력 체크용)
    public List<Integer> selectAttendanceDays(AttendanceDTO dto) {
    	
        SqlSession sqlSession = factory.openSession();
        
        List<Integer> days = sqlSession.selectList("selectAttendanceDays", dto);
        
        sqlSession.close();
        
        return days;
    }

}
