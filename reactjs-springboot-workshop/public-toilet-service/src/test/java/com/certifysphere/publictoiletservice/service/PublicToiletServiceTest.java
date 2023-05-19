package com.certifysphere.publictoiletservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.certifysphere.publictoiletservice.model.PublicToilet;
import com.certifysphere.publictoiletservice.repository.PublicToiletRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class PublicToiletServiceTest {
    
    @Mock
    private PublicToiletRepository toiletRepository;
    
    @InjectMocks
    private PublicToiletService toiletService;
    
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void getAllToiletsTest() {
        List<PublicToilet> toiletList = Arrays.asList(
            new PublicToilet("Public Toilet 1", "City 1", "State 1", "Country 1"),
            new PublicToilet("Public Toilet 2", "City 2", "State 2", "Country 2"),
            new PublicToilet("Public Toilet 3", "City 3", "State 3", "Country 3")
        );
        when(toiletRepository.findAll()).thenReturn(toiletList);
        List<PublicToilet> result = toiletService.getAllToilets();
        assertEquals(3, result.size());
    }
    
    @Test
    public void getToiletByIdTest() {
        PublicToilet toilet = new PublicToilet("Public Toilet 1", "City 1", "State 1", "Country 1");
        when(toiletRepository.findById(1L)).thenReturn(Optional.of(toilet));
        Optional<PublicToilet> result = toiletService.getToiletById(1L);
        assertTrue(result.isPresent());
        assertEquals("Public Toilet 1", result.get().getName());
        assertEquals("City 1", result.get().getCity());
        assertEquals("State 1", result.get().getState());
        assertEquals("Country 1", result.get().getCountry());
    }
    
    
    @Test
    public void addNewToiletTest() {
        PublicToilet toilet = new PublicToilet("Public Toilet 1", "City 1", "State 1", "Country 1");
        when(toiletRepository.save(toilet)).thenReturn(toilet);
        PublicToilet result = toiletService.createToilet(toilet);
        assertEquals("Public Toilet 1", result.getName());
        assertEquals("City 1", result.getCity());
        assertEquals("State 1", result.getState());
        assertEquals("Country 1", result.getCountry());
    }
    
    @Test
    public void updateToiletTest() {
        Long id = 1L;
        PublicToilet updatedToilet = new PublicToilet("Updated Public Toilet", "Updated City", "Updated State", "Updated Country");
        PublicToilet existingToilet = new PublicToilet("Public Toilet 1", "City 1", "State 1", "Country 1");
        
        when(toiletRepository.findById(id)).thenReturn(Optional.of(existingToilet));
        when(toiletRepository.save(existingToilet)).thenReturn(existingToilet);
        
        PublicToilet result = toiletService.updateToilet(id, updatedToilet);
        
        assertEquals("Updated Public Toilet", result.getName());
        assertEquals("Updated City", result.getCity());
        assertEquals("Updated State", result.getState());
        assertEquals("Updated Country", result.getCountry());
    }
    
    
    @Test
    public void deleteToiletTest() {
        toiletService.deleteToilet(1L);
        verify(toiletRepository, times(1)).deleteById(1L);
    }
}
