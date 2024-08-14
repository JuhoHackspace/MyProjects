package fi.oamk.muuvi.backend.services;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(1)
public class RequestFilter extends OncePerRequestFilter{


    @Value("${jwt.secret}")
    private String jwtKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        //Only private paths are checked
        if(request.getServletPath().indexOf("private") < 0 ){
            filterChain.doFilter(request, response);
            return;
        }

        String auth = request.getHeader("Authorization");

        if(auth != null){
            String[] bearer = auth.split(" ");
            if(bearer.length > 1){
                Long jwtSub = validateJwt(bearer[1]);
                if(jwtSub != null){
                    request.setAttribute("jwtSub", jwtSub);
                    filterChain.doFilter(request, response);
                    return;
                }
            }
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("Forbidden access!");
        response.getWriter().flush();
    }

    /**
     * Verify jwt token and return username if token is valid
     */
    public Long validateJwt(String jwtToken){
        Algorithm alg = Algorithm.HMAC256(jwtKey);
        JWTVerifier verifier = JWT.require(alg).build();

        try {
            DecodedJWT jwt = verifier.verify(jwtToken);
            return Long.parseLong(jwt.getSubject());
        } catch (JWTVerificationException e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

    /**
     * Omitting this filter for options and other than private endpoints.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getMethod().equalsIgnoreCase("options") || request.getServletPath().indexOf("private") < 0;
    }
}
