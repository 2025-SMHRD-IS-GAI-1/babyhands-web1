package com.babyhands.dao;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import com.babyhands.config.MysqlSessionManager;
import com.babyhands.vo.SlTestResultVO;

public class SlTestResultDAO {
    private final SqlSessionFactory factory = MysqlSessionManager.getFactory();

    /** 
     * 결과 저장
     * - 매퍼: <selectKey>로 slTestId 세팅 (오라클)
     * - 반환: 영향 행 수(=1). 생성 PK는 vo.getSlTestId()로 확인 가능.
     */
    public int insertSignTestResult(SlTestResultVO vo) {
        if (vo == null) throw new IllegalArgumentException("vo is null");
        if (vo.getMemberId() == null || vo.getMemberId().isBlank()) {
            throw new IllegalArgumentException("memberId is blank");
        }

        // auto-commit true 그대로 OK (단, 여러 쿼리를 한 트랜잭션으로 묶을 땐 false + commit())
        try (SqlSession s = factory.openSession(true)) {
            int rows = s.insert("com.babyhands.dao.SlTestResultDAO.insertSignTestResult", vo);
            // selectKey가 BEFORE라면 여기서 이미 vo.slTestId 세팅 완료
            return rows;
        }
    }

    /** 최신 결과 1건 (단일 String 파라미터 → 매퍼에서 #{value}로 받아야 함) */
    public SlTestResultVO selectLatestResultByMember(String memberId) {
        if (memberId == null || memberId.isBlank()) return null;
        try (SqlSession s = factory.openSession()) {
            return s.selectOne(
                "com.babyhands.dao.SlTestResultDAO.selectLatestResultByMember",
                memberId
            );
        }
    }

    /** 요약(정확도/랭킹) (단일 String 파라미터 → 매퍼에서 #{value}) */
    public SlTestResultVO selectResultSummary(String memberId) {
        if (memberId == null || memberId.isBlank()) return null;
        try (SqlSession s = factory.openSession()) {
            return s.selectOne(
                "com.babyhands.dao.SlTestResultDAO.selectResultSummary",
                memberId
            );
        }
    }
}
