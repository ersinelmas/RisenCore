package com.risencore.risencore_api.config;

import com.risencore.risencore_api.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. Check if the request has a valid JWT in the Authorization header.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // If not, pass to the next filter.
            return;
        }

        // 2. Extract the token from the header.
        jwt = authHeader.substring(7); // "Bearer ".length()

        try {
            // 3. Extract the username from the token.
            username = jwtService.extractUsername(jwt);

            // 4. Check if the user is not already authenticated.
            if (username != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load user details from the database.
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 5. Validate the token.
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // If token is valid, create an authentication token.
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null, // We don't have credentials, as the user is already
                                    // authenticated via token.
                                    userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    // 6. Update the SecurityContextHolder with the new authentication token.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (JwtException | IllegalArgumentException ex) {
            // Malformed, expired, or tampered token: leave the request unauthenticated so
            // Spring Security's entry point returns a clean 401 instead of an unhandled 500.
            log.debug("Rejected invalid JWT: {}", ex.getMessage());
            SecurityContextHolder.clearContext();
        }
        // Pass the request to the next filter in the chain.
        filterChain.doFilter(request, response);
    }
}
