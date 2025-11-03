package com.babyhands.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import com.babyhands.config.MysqlSessionManager;

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
	

    // ✅ 2. 출석한 날짜 리스트 불러오기 (달력 체크용)
    public List<Integer> selectAttendanceDays(String memberId, int year, int month) {
        SqlSession sqlSession = factory.openSession();
        List<Integer> days = sqlSession.selectList(
            "selectAttendanceDays", // mapper.xml의 id와 일치해야 함!
            new AttendanceParam(memberId, year, month)
        );
        sqlSession.close();
        return days;
    }

    // ✅ 내부 클래스 (파라미터 전달용)
    public static class AttendanceParam {
        private String memberId;
        private int year;
        private int month;

        public AttendanceParam(String memberId, int year, int month) {
            this.memberId = memberId;
            this.year = year;
            this.month = month;
        }

        // getter
        public String getMemberId() { return memberId; }
        public int getYear() { return year; }
        public int getMonth() { return month; }
    }
	
}
