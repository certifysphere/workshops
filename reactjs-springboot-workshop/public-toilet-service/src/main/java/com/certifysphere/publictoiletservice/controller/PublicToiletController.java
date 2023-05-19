package com.certifysphere.publictoiletservice.controller;

import com.certifysphere.publictoiletservice.model.PublicToilet;
import com.certifysphere.publictoiletservice.service.PublicToiletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/public-toilets")
public class PublicToiletController {

    private final PublicToiletService toiletService;

    @Autowired
    public PublicToiletController(PublicToiletService toiletService) {
        this.toiletService = toiletService;
    }

    @GetMapping
    public List<PublicToilet> getAllToilets() {
        return toiletService.getAllToilets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicToilet> getToiletById(@PathVariable Long id) {
        
        Optional<PublicToilet> toiletOptional = toiletService.getToiletById(id);
        
        if (toiletOptional.isPresent()) {
            PublicToilet toilet = toiletOptional.get();
            return ResponseEntity.ok(toilet);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public PublicToilet createToilet(@RequestBody PublicToilet toilet) {
        return toiletService.createToilet(toilet);
    }

    @PutMapping("/{id}")
    public PublicToilet updateToilet(@PathVariable Long id, @RequestBody PublicToilet updatedToilet) {
        return toiletService.updateToilet(id, updatedToilet);
    }

    @DeleteMapping("/{id}")
    public void deleteToilet(@PathVariable Long id) {
        toiletService.deleteToilet(id);
    }
}
