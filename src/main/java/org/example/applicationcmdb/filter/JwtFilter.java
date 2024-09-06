package org.example.applicationcmdb.filter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.example.applicationcmdb.repo.TokenRepo;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.userdetails.UserDetails;
import java.io.IOException;

@Component
@RequiredArgsConstructor // ysn3 ay construct mn ay final ndeclariwh lahne
public class JwtFilter extends OncePerRequestFilter {
    private  final JwtService jwtService;

    private  final UserDetailsService us;
    private final TokenRepo authTokenRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull  HttpServletResponse response,
                                    @NonNull   FilterChain filterChain) throws ServletException, IOException {
        System.out.println("FELTERING");
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;
        System.out.println(request.getRequestURI());
        if (authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            email = jwtService.extractUsernameFromToken(token);
        }
        System.out.println(authHeader);
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = us.loadUserByUsername(email);
            var isValideToken= authTokenRepository.findByToken(token).map(t->!t.isExpired() && !t.isRevoked()).orElse(false);
            if(jwtService.validateToken(token, userDetails) && isValideToken) {
                var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                System.out.println(authToken);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }


}













