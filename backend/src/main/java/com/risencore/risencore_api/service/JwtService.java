package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    private final JwtParser jwtParser;

    public JwtService(@Value("${application.security.jwt.secret-key}") String secretKey) {
        this.secretKey = secretKey;
        this.jwtParser = Jwts.parser().verifyWith(getSignInKey()).build();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, jwtExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        // Add roles to the claims, removing the "ROLE_" prefix.
        List<String> roles =
                userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .map(role -> role.replace("ROLE_", "")) // Removes the prefix
                        .collect(Collectors.toList());
        extraClaims.put("roles", roles);

        if (userDetails instanceof User) {
            extraClaims.put("email", ((User) userDetails).getEmail());
            extraClaims.put("firstName", ((User) userDetails).getFirstName());
            extraClaims.put("lastName", ((User) userDetails).getLastName());
        }

        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return jwtParser.parseSignedClaims(token).getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(this.secretKey);
        } catch (io.jsonwebtoken.io.DecodingException | IllegalArgumentException e) {
            try {
                // Try Base64URL if Base64 fails (e.g. contains '-' or '_')
                keyBytes = Decoders.BASE64URL.decode(this.secretKey);
            } catch (io.jsonwebtoken.io.DecodingException | IllegalArgumentException e2) {
                // Fallback to raw bytes if both fail (e.g. plain text secret)
                keyBytes = this.secretKey.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            }
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
