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
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/error").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/korisnici/registracija").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/korisnici/registracija/kupac").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/korisnici/login").permitAll()

                        // Javni GET endpointi
                        .requestMatchers(HttpMethod.GET, "/api/korisnici-pomoci/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usluge-proizvodi/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/kategorije/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/donacije/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/recenzije/**").permitAll()

                        // Direktna donacija
                        .requestMatchers(HttpMethod.POST, "/api/donacije").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/donacije/").permitAll()

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
                        .requestMatchers("/api/volonter-info/**").hasAnyRole("volonter", "administrator")

                        // ── Kupac ──────────────────────────────────────────────────────
                        .requestMatchers(HttpMethod.POST, "/api/kupovine/**").hasRole("kupac")
                        .requestMatchers(HttpMethod.POST, "/api/recenzije/dodaj").hasRole("kupac")

                        // ── Profil ─────────────────────────────────────────────────────
                        .requestMatchers("/api/profili/**").authenticated()

                        // ── Sve ostalo ─────────────────────────────────────────────────
                        .anyRequest().authenticated()
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
}
