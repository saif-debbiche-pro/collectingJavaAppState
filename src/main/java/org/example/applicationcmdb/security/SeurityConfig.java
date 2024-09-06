package org.example.applicationcmdb.security;


import lombok.RequiredArgsConstructor;
import org.example.applicationcmdb.filter.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SeurityConfig {
    private final LogoutHandler logoutHandler;
    private final JwtFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
    {    // Disable Cross-Origin Resource Sharing (CORS)
        http.cors(Customizer.withDefaults())

                // Disable Cross-Site Request Forgery (CSRF) protection
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                                .requestMatchers(auth_whitelist).permitAll()
                                .requestMatchers("/register/**").permitAll()
                                .requestMatchers("/getroles").permitAll()
                                .requestMatchers("/user/**").permitAll()
                                .requestMatchers("/admin/**").permitAll()
                                .requestMatchers("/login/**").permitAll()
                                .requestMatchers("/getenabled").permitAll()
                                .requestMatchers("/getclasstypes").permitAll()
                                .requestMatchers("/files/**").permitAll()
                                .requestMatchers("/user/update/email/verify").permitAll()
                                .requestMatchers("/user/me").permitAll()
                                .requestMatchers("/book/**").permitAll()
                                .requestMatchers("/event/**").permitAll()
                                .requestMatchers("/image/**").permitAll()
                                .requestMatchers("/api/applications/metrics").permitAll()


                                .anyRequest().authenticated()
                )

                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                // Add JWT authentication filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)





        ;


        return http.build();
    }
    private static final String [] auth_whitelist={
            "/api/v1/auth/**",
            "/v3/api-docs/**",
            "/v3/api-docs.yaml",
            "/swagger-ui/**",
            "/swagger-ui-html"
    };
}








