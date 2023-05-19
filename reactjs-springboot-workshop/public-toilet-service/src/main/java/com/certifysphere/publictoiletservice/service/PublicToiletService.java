package com.certifysphere.publictoiletservice.service;

import com.certifysphere.publictoiletservice.model.PublicToilet;
import com.certifysphere.publictoiletservice.repository.PublicToiletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublicToiletService {

    private final PublicToiletRepository publicToiletRepository;

    @Autowired
    public PublicToiletService(PublicToiletRepository publicToiletRepository) {
        this.publicToiletRepository = publicToiletRepository;
    }

    public List<PublicToilet> getAllToilets() {
        return publicToiletRepository.findAll();
    }

    public Optional<PublicToilet> getToiletById(Long id) {
        return publicToiletRepository.findById(id);
    }

    public PublicToilet createToilet(PublicToilet toilet) {
        return publicToiletRepository.save(toilet);
    }

    public PublicToilet updateToilet(Long id, PublicToilet updatedToilet) {
        Optional<PublicToilet> existingToilet = publicToiletRepository.findById(id);

        if (existingToilet.isPresent()) {
            PublicToilet toilet = existingToilet.get();
            toilet.setName(updatedToilet.getName());
            toilet.setCity(updatedToilet.getCity());
            toilet.setState(updatedToilet.getState());
            toilet.setCountry(updatedToilet.getCountry());
            return publicToiletRepository.save(toilet);
        } else {
            throw new RuntimeException("Toilet not found with id: " + id);
        }
    }

    public void deleteToilet(Long id) {
        publicToiletRepository.deleteById(id);
    }
}
