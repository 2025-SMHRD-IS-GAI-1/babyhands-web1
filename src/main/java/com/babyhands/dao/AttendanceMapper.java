package com.babyhands.dao;

import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface AttendanceMapper {
    List<Integer> selectAttendanceDays(@Param("memberId") String memberId,
                                       @Param("year") int year,
                                       @Param("month") int month);
}