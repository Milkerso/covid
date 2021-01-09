package com.example.covid.service;

import com.example.covid.model.CovidDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CovidServiceImpl {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${resources.covid}")
    private String resource;
    @Value("${resources.covid}/{id}")
    private String idResource;


    public List<CovidDTO> findAll() {
        return Arrays.stream(Objects.requireNonNull(restTemplate.getForObject(resource, CovidDTO[].class))).collect(Collectors.toList());
    }
}
