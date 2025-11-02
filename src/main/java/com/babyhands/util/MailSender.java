package com.babyhands.util;


import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class MailSender {

	public static void sendHtml(String to, String subject, String html) throws MessagingException {
        // 1) JNDI mail/Session 시도
        Session session = lookupMailSession();
        String user = null, pass = null;

        if (session == null) {
            // 2) 폴백: JNDI Environment → 시스템 환경변수
            user = coalesce(lookupEnv("mail.username"), System.getenv("MAIL_USERNAME"));
            pass = coalesce(lookupEnv("mail.password"), System.getenv("MAIL_PASSWORD"));

            if (isBlank(user) || isBlank(pass)) {
                throw new MessagingException("메일 인증정보 없음 (mail.username/password 또는 MAIL_USERNAME/PASSWORD 설정 필요)");
            }
            session = buildSession(user, pass); // 587 STARTTLS
        }

        // 3) From 결정: JNDI 세션이면 mail.from 또는 user 사용
        String from = !isBlank(user) ? user : coalesce(session.getProperty("mail.from"), user);
        if (isBlank(from)) from = user; // 그래도 없으면 user

        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(from));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));
        msg.setSubject(subject, "UTF-8");
        msg.setContent(html, "text/html; charset=UTF-8");
        Transport.send(msg);
    }

    // ---------- 내부 헬퍼 ----------

    private static Session lookupMailSession() {
        try {
            Context env = getEnv();
            if (env == null) return null;
            Object obj = env.lookup("mail/Session");
            return (obj instanceof Session) ? (Session) obj : null;
        } catch (NamingException e) {
            return null;
        }
    }

    private static String lookupEnv(String name) {
        try {
            Context env = getEnv();
            if (env == null) return null;
            Object v = env.lookup(name);
            return (v != null) ? String.valueOf(v) : null;
        } catch (NamingException e) {
            return null;
        }
    }

    private static Context getEnv() {
        try {
            return (Context) new InitialContext().lookup("java:comp/env");
        } catch (NamingException e) {
            return null;
        }
    }

    private static Session buildSession(String username, String password) {
        Properties p = new Properties();
        p.put("mail.transport.protocol", "smtp");
        p.put("mail.smtp.auth", "true");
        p.put("mail.smtp.host", "smtp.gmail.com");
        p.put("mail.smtp.port", "587");
        p.put("mail.smtp.starttls.enable", "true");
        p.put("mail.smtp.ssl.protocols", "TLSv1.2");
        p.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        p.put("mail.smtp.connectiontimeout", "10000");
        p.put("mail.smtp.timeout", "10000");

        return Session.getInstance(p, new Authenticator() {
            @Override protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    }

    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private static String coalesce(String a, String b) { return isBlank(a) ? b : a; }
}
