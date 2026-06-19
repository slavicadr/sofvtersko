package com.fakultet.dobrobit.repositories;

import com.fakultet.dobrobit.models.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    List<Partner> findAllByOrderByRedoslijedAscIdAsc();
}
