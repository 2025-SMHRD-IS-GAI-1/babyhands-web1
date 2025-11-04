package com.babyhands.dao;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import com.babyhands.config.MysqlSessionManager;
import com.babyhands.vo.SlTestResultVO;
import com.babyhands.vo.SlTestVO;

public class SlTestResultDAO {
    private final SqlSessionFactory factory = MysqlSessionManager.getFactory();

    public int insertSignTestResult(SlTestResultVO vo) { 
        SqlSession s = factory.openSession(true); // auto-commit
        int out = s.insert("com.babyhands.dao.SlTestResultDAO.insertSignTestResult", vo);
        s.close();
        return out;
    }

    public SlTestResultVO selectLatestResultByMember(String memberId) {
        SqlSession s = factory.openSession();
        SlTestResultVO out = s.selectOne("com.babyhands.dao.SlTestResultDAO.selectLatestResultByMember", memberId);
        s.close();
        return out;
    }

    public SlTestResultVO selectResultSummary(String memberId) {        
        SqlSession s = factory.openSession();
        SlTestResultVO out = s.selectOne("com.babyhands.dao.SlTestResultDAO.selectResultSummary", memberId);
        s.close();
        return out;
    }
}
