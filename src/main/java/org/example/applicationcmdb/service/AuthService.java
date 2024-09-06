package org.example.applicationcmdb.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.applicationcmdb.dto.AuthenticationRequest;
import org.example.applicationcmdb.dto.AuthenticationResponse;
import org.example.applicationcmdb.entity.Token;
import org.example.applicationcmdb.entity.User;
import org.example.applicationcmdb.filter.JwtService;
import org.example.applicationcmdb.repo.TokenRepo;
import org.example.applicationcmdb.repo.UserRepo;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService  {
    private final AuthenticationManager authenticationManager;
    @Resource
    private UserRepo userRepository;
    @Resource
    private JwtService jwtService;
    @Resource
    private TokenRepo authTokenRepository;


    /********************* authenticate user methode implement **********************/

    public AuthenticationResponse authenticate(AuthenticationRequest request)
    {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (Exception e)
        {
            throw new BadCredentialsException("bad credentials");
        }
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken=jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                // .secretImageUri(tfaService.generateQrCodeImageUri(user.getSecret()))
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .mfaEnabled(false)
                .build();
    }

    /********************* set expired and revoked all the user tokens when he login again => 1 sessions****************/

    public void revokeAllUserTokens(User user)
    {
        var validUserTokens =  authTokenRepository.findAllValidTokensByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(t  -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        authTokenRepository.saveAll(validUserTokens);

    }
    /********************** save the user jwt token *******************/
    public void saveUserToken(User user, String jwtToken)
    {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .createdAt(Timestamp.from(Instant.now()))
                .revoked(false)
                .expired(false)
                .build();
        authTokenRepository.save(token);
    }
    /*********************** update user token **************************/
    public void updateToken(User user, String jwtToken) {
        Token existingToken = authTokenRepository.findTopByUserOrderByCreatedAtDesc(user);
        if (existingToken != null) {
            existingToken.setToken(jwtToken);
            existingToken.setCreatedAt(Timestamp.from(Instant.now()));
            existingToken.setExpired(false);
            existingToken.setRevoked(false);
            authTokenRepository.save(existingToken);
        }
    }

/***************** update the user token ***************/




    /********************** verify the double authentication code *********************/



    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsernameFromToken(refreshToken);//because mainly with spring boot we talk about usernames
        if (userEmail != null ) {
            var  user = this.userRepository.findByEmail(userEmail).orElseThrow();
            if (jwtService.validateToken(refreshToken, user)){
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .mfaEnabled(false)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(),authResponse);
            }
        }
    }
}







