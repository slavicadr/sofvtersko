package com.fakultet.dobrobit.services;

import com.fakultet.dobrobit.models.Korisnik;
import com.fakultet.dobrobit.models.LogAktivnosti;
import com.fakultet.dobrobit.repositories.LogAktivnostiRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LogAktivnostiService {

    private final LogAktivnostiRepository repository;

    public LogAktivnostiService(LogAktivnostiRepository repository) {
        this.repository = repository;
    }

    public void logLogin(Korisnik korisnik, String ipAdresa) {
        repository.save(new LogAktivnosti(korisnik, "LOGIN", ipAdresa, null));
    }

    public void logLogout(Korisnik korisnik, String ipAdresa) {
        repository.save(new LogAktivnosti(korisnik, "LOGOUT", ipAdresa, null));
    }

    // Failed login — no Korisnik object available, only the attempted email
    public void logNeuspioPrijava(String email, String ipAdresa) {
        repository.save(new LogAktivnosti(null, "LOGIN_NEUSPIO", ipAdresa,
                "Pokušaj prijave za: " + email));
    }

    public List<LogAktivnosti> getSvi() {
        return repository.findAllByOrderByVrijemeAktivnostiDesc();
    }

    public List<LogAktivnosti> getByTip(String tip) {
        return repository.findByTipAktivnosti(tip);
    }

    public List<LogAktivnosti> getByKorisnik(Korisnik korisnik) {
        return repository.findByKorisnikOrderByVrijemeAktivnostiDesc(korisnik);
    }

    public Map<String, Long> getStatistike() {
        return Map.of(
                "LOGIN",              (long) repository.findByTipAktivnosti("LOGIN").size(),
                "LOGOUT",             (long) repository.findByTipAktivnosti("LOGOUT").size(),
                "LOGIN_NEUSPIO",      (long) repository.findByTipAktivnosti("LOGIN_NEUSPIO").size(),
                "SUMNJIVA_AKTIVNOST", (long) repository.findByTipAktivnosti("SUMNJIVA_AKTIVNOST").size()
        );
    }
}
