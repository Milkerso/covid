package com.example.covid.controller;


import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/covid")
public class CovidController {

    @Autowired
    private RestTemplate restTemplate;


    @RequestMapping("/{country}")
    public String getCovidList(@PathVariable String country) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime monthAgo = now.minusMonths(1);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        System.out.println("https://covidapi.info/api/v1/country/" + country + "/timeseries/" + dtf.format(monthAgo) + "/" + dtf.format(now));
        return restTemplate.exchange("" +
                "https://covidapi.info/api/v1/country/" + country + "/timeseries/" + dtf.format(monthAgo) + "/" + dtf.format(now), HttpMethod.GET, entity, String.class).getBody();

    }

    @RequestMapping("/{country}/{date}")
    public String getCovidListDate(@PathVariable String country, @PathVariable String date) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange("" +
                "https://covidapi.info/api/v1/country/" + country + "/" + date, HttpMethod.GET, entity, String.class).getBody();
    }

    @RequestMapping("/allCountry")
    public String getCovidListDate() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange("" +
                "https://covidapi.info/api/v1/global/latest", HttpMethod.GET, entity, String.class).getBody();
    }


    @RequestMapping("/global")
    public String getCovidListGlobal() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange("" +
                "https://covidapi.info/api/v1/global", HttpMethod.GET, entity, String.class).getBody();
    }

    @RequestMapping("/global/{date}")
    public String getCovidListGlobalDate(@PathVariable String date) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange("" +
                "https://covidapi.info/api/v1/global/" + date, HttpMethod.GET, entity, String.class).getBody();
    }

    @RequestMapping("/global/{dateStart}/{dateEnd}")
    public String getCovidListGlobalDateRange(@PathVariable String dateStart, @PathVariable String dateEnd) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange("" +
                "https://covidapi.info/api/v1/global/" + dateStart + "/" + dateEnd, HttpMethod.GET, entity, String.class).getBody();
    }

    @RequestMapping("/global/count}")
    public String getCovidListGlobalCount() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange("" +
                "https://covidapi.info/api/v1/global/count", HttpMethod.GET, entity, String.class).getBody();
    }

    @RequestMapping("/wojewodztwo")
    public String getCovidDataWojewodztwo() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        return restTemplate.exchange("" +
                "https://api.apify.com/v2/key-value-stores/3Po6TV7wTht4vIEid/records/LATEST?disableRedirect=true", HttpMethod.GET, entity, String.class).getBody();
    }
    @RequestMapping("/simulation")
    public String getCovidDataSimulation() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        Object rest = restTemplate.exchange("" +
                "https://covidapi.info/api/v1/global/count", HttpMethod.GET, entity, Object.class).getBody();
//        JSONObject jsonObject= new JSONObject(rest.toString());
        System.out.println(rest);
//        System.out.println(jsonObject);
        return null;
    }

}
