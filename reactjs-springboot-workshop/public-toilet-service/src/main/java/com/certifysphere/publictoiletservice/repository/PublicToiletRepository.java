package com.certifysphere.publictoiletservice.repository;

import com.certifysphere.publictoiletservice.model.PublicToilet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicToiletRepository extends JpaRepository<PublicToilet, Long>{
}
