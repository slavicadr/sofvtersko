package com.fakultet.dobrobit.config;

import com.fakultet.dobrobit.services.KorisnikDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final KorisnikDetailsService korisnikDetailsService;

    public SecurityConfig(KorisnikDetailsService korisnikDetailsService) {
        this.korisnikDetailsService = korisnikDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/error").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/korisnici/registracija").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/korisnici/registracija/kupac").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/korisnici/registracija/prviAdmin").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/korisnici/login").permitAll()

                        // Javni GET endpointi
                        .requestMatchers(HttpMethod.GET, "/api/korisnici-pomoci/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usluge-proizvodi/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/kategorije/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/donacije/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/recenzije/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/kupovine").permitAll()

                        // Direktna donacija
                        .requestMatchers(HttpMethod.POST, "/api/donacije").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/donacije/").permitAll()

                        // CV upload — javno dostupno jer se dešava prije registracije
                        .requestMatchers("/api/upload/**").permitAll()

                        // Provjera dostupnosti emaila — javno dostupno za registraciju
                        .requestMatchers(HttpMethod.GET, "/api/korisnici/provjeri-email").permitAll()

                        // PRIVREMENO za testiranje — inače radi administrator
                        .requestMatchers(HttpMethod.POST, "/api/korisnici-pomoci").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/korisnici-pomoci/").permitAll()

                        // ── Administrator ──────────────────────────────────────────────
                        .requestMatchers("/api/verifikacije/**").hasRole("administrator")
                        .requestMatchers(HttpMethod.DELETE, "/api/korisnici/**").hasRole("administrator")
                        .requestMatchers(HttpMethod.DELETE, "/api/recenzije/**").hasRole("administrator")
                        .requestMatchers(HttpMethod.GET, "/api/korisnici").hasRole("administrator")
                        .requestMatchers(HttpMethod.GET, "/api/korisnici/**").hasRole("administrator")
                        .requestMatchers(HttpMethod.PUT, "/api/korisnici/**").hasRole("administrator")

                        // ── Volonter ───────────────────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/usluge-proizvodi").hasRole("volonter")
                        .requestMatchers(HttpMethod.DELETE, "/api/usluge-proizvodi/**").hasRole("volonter")
                        // GET volonter info je javno (profili, recenzije, bio)
                        .requestMatchers(HttpMethod.GET, "/api/volonter-info/**").permitAll()
                        .requestMatchers("/api/volonter-info/**").hasAnyRole("volonter", "administrator")

                        // ── Kupac / Kupovina ───────────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/kupovine/kupi").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/recenzije/dodaj").authenticated()

                        // Realizacija usluge — kupac, volonter ili admin
                        .requestMatchers(HttpMethod.PATCH, "/api/kupovine/*/realizovano").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/kupovine/volonter/**").hasAnyRole("volonter", "administrator")

                        // ── Profil ─────────────────────────────────────────────────────
                        .requestMatchers("/api/profili/**").authenticated()

                        // ── Sve ostalo ─────────────────────────────────────────────────
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Session expired"))
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(korisnikDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
