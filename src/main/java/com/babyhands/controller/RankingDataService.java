package com.babyhands.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.babyhands.dao.SlTestDAO;
import com.babyhands.dto.MemberScoreRank;
import com.babyhands.frontController.Command;
import com.google.gson.Gson;

public class RankingDataService implements Command {

    @Override
    public String execute(HttpServletRequest request, HttpServletResponse response) {

        int offset = parseInt(request.getParameter("offset"), 0);
        int limit  = parseInt(request.getParameter("limit"), 20);

        SlTestDAO dao = new SlTestDAO();
        Map<String, Integer> p = new HashMap<>();
        p.put("offset", offset);
        p.put("limit",  limit);

        List<MemberScoreRank> items = dao.selectRankingSlice(p);
        int total = dao.countAllRanking();

        Map<String, Object> body = new HashMap<>();
        body.put("total", total);
        body.put("offset", offset);
        body.put("limit", limit);
        body.put("items", items);

        writeJson(response, body);
        return null;
    }

    private int parseInt(String s, int def) {
        try { return Integer.parseInt(s); }
        catch (Exception e) { return def; }
    }

    private void writeJson(HttpServletResponse resp, Object data) {
        try {
            resp.setContentType("application/json; charset=UTF-8");
            new Gson().toJson(data, resp.getWriter());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
