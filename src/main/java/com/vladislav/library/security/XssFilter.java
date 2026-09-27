package com.vladislav.library.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class XssFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(new XssRequestWrapper((HttpServletRequest) request), response);
    }

    private static class XssRequestWrapper extends HttpServletRequestWrapper {

        public XssRequestWrapper(HttpServletRequest request) {
            super(request);
        }

        @Override
        public String[] getParameterValues(String parameter) {
            String[] values = super.getParameterValues(parameter);
            if (values == null) return null;

            String[] cleanValues = new String[values.length];
            for (int i = 0; i < values.length; i++) {
                cleanValues[i] = sanitize(values[i]);
            }
            return cleanValues;
        }

        @Override
        public String getParameter(String parameter) {
            String value = super.getParameter(parameter);
            return sanitize(value);
        }

        @Override
        public String getHeader(String name) {
            String value = super.getHeader(name);
            return sanitize(value);
        }

        private String sanitize(String value) {
            if (value == null) return null;
            return value
                    .replaceAll("<script>", "&lt;script&gt;")
                    .replaceAll("</script>", "&lt;/script&gt;")
                    .replaceAll("<script", "&lt;script")
                    .replaceAll("javascript:", "")
                    .replaceAll("onerror=", "data-onerror=")
                    .replaceAll("onload=", "data-onload=")
                    .replaceAll("<iframe", "&lt;iframe")
                    .replaceAll("</iframe>", "&lt;/iframe&gt;");
        }
    }
}
