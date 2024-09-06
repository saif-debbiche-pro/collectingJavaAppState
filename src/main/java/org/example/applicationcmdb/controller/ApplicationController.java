package org.example.applicationcmdb.controller;

 // Add this import for JSON handling

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import jakarta.websocket.server.PathParam;
import org.example.applicationcmdb.dto.ApplicationReccord;
import org.example.applicationcmdb.dto.Normalization;
import org.example.applicationcmdb.entity.Application;
import org.example.applicationcmdb.entity.ApplicationAudit;
import org.example.applicationcmdb.entity.ChangeAction;
import org.example.applicationcmdb.repo.ApplicationRepo;
import org.example.applicationcmdb.service.ApplicationService;
import org.example.applicationcmdb.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.swing.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {


    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private AuditService auditService;


    private  RestTemplate restTemplate;

    @Value("${python.compare.url}")
    private String pythonWebhookUrl;








    @GetMapping
    public List<ApplicationReccord> getAll(){
        return Normalization.serializeListApplicationToListApplicationReccord(applicationService.getAll());
    }

    @GetMapping("/{applicaiontId}")
    public ApplicationReccord getApp(@PathVariable Long applicaiontId){
        return Normalization.serializeApplicationToApplicationReccord(applicationService.getApplication(applicaiontId));
    }


    @PostMapping
    public ApplicationReccord add(@RequestBody ApplicationReccord applicationReccord){
        return applicationService.create(applicationReccord);
    }

    @PutMapping("/{applicationId}")
    public ResponseEntity<String> upadte(@RequestBody ApplicationReccord applicationReccord, @PathVariable Long applicationId,@PathParam("action") String action){


        String pythonActionsUrl=pythonWebhookUrl+"/get-actions";
        if(Objects.equals(action, "validate")){
            HttpEntity<ApplicationReccord> requestEntity = new HttpEntity<>(applicationReccord);
            restTemplate =new RestTemplate();
            try{
                ResponseEntity<String> responseEntity = restTemplate.exchange(pythonActionsUrl, HttpMethod.POST, requestEntity, String.class);
                String responseMessage = responseEntity.getBody();
                System.out.println(responseMessage);

                System.out.println(responseMessage);

                return ResponseEntity.status(HttpStatus.OK)
                        .body(responseMessage);

            }catch(HttpClientErrorException e){
                System.out.println(e.getResponseBodyAsString());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body( e.getResponseBodyAsString());

            }catch (RuntimeException e){
                System.out.println(e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("agen did not respond");
            }    
        } else if (Objects.equals(action, "save")) {
            System.out.println(applicationReccord);
            ApplicationReccord newState= applicationService.update(applicationReccord,applicationId);

        }


        return ResponseEntity.ok("Specify the wanted action");

    }

    @DeleteMapping("/{applicationId}")
    public Boolean delete(@PathVariable Long applicationId){
        return applicationService.deleteApp(applicationId);
    }

    @PostMapping("/{appId}/reevaluate")
    public ResponseEntity<?> reevaluateActions(@RequestBody ApplicationReccord applicationReccord,@PathVariable Long appId){
        final String pythonActionsUrl=pythonWebhookUrl+"/get-actions";
        HttpEntity<ApplicationReccord> requestEntity = new HttpEntity<>(applicationReccord);
        restTemplate =new RestTemplate();
        try{
            ResponseEntity<String> responseEntity = restTemplate.exchange(pythonActionsUrl, HttpMethod.POST, requestEntity, String.class);
            String responseMessage = responseEntity.getBody();

            Application newState= applicationService.updateActions(appId,responseMessage);

            System.out.println(responseMessage);


            return ResponseEntity.status(HttpStatus.OK)
                    .body(newState);

        }catch(HttpClientErrorException e){
            System.out.println(e.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body( e.getResponseBodyAsString());

        }catch (RuntimeException e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body( "agen did not respond");
        }
    }

    @PostMapping("/{appId}/synchronize")
    public ResponseEntity<?> syncronize(@RequestBody ApplicationReccord applicationReccord,@PathVariable Long appId){
        String pythonCurrentState=pythonWebhookUrl+"/get-current-state";
        restTemplate =new RestTemplate();
        try{

            // Define the URL and include the app name as a query parameter

            String urlWithParams = UriComponentsBuilder.fromHttpUrl(pythonCurrentState)
                    .queryParam("app_name", applicationReccord.applicationName())
                    .queryParam("app_type", applicationReccord.applicationType())
                    .queryParam("namespace",applicationReccord.namespace() )
                    .toUriString();
            // Create the request entity (headers, etc., if needed)
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);

            // Make the GET request
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    urlWithParams,
                    HttpMethod.GET,
                    requestEntity,
                    String.class
                    );

            // Get the response body
            String responseMessage = responseEntity.getBody();
            System.out.println(responseMessage);
            ObjectMapper objectMapper = new ObjectMapper();
             ApplicationReccord app=objectMapper.readValue(responseMessage, ApplicationReccord.class);



             System.out.println(app);

            ApplicationReccord newState= applicationService.update(app,appId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(newState);

        }catch(HttpClientErrorException e){
            System.out.println(e.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body( e.getResponseBodyAsString());

        }catch (RuntimeException e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body( "agen did not respond");
        }catch(JsonProcessingException e){

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body( "cant map the application response to a valid app");
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<?> getPodMetrics(@RequestParam("podName") String podName,@RequestParam("namespace") String namespace) {
        try{
        RestTemplate restTemplate = new RestTemplate();
        if(namespace==null) namespace="default";
        String url = pythonWebhookUrl + "/metrics?pod_name=" + podName+"&namespace="+namespace;
        System.out.println(url);

        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }catch(HttpClientErrorException e){
        System.out.println(e.getResponseBodyAsString());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body( e.getResponseBodyAsString());

    }catch (RuntimeException e){
        System.out.println(e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body( "agen did not respond");
    }
    }

    @GetMapping("/audit/{appId}")
    public List<ApplicationAudit> getAudit(@PathVariable Long appId){
        return auditService.getAuditApp(appId);
    }

//    @GetMapping("/audit_v2")
//    public List getAuditList(){
//        System.out.println(auditService.getAuditApp_v2());
//        return auditService.getAuditApp_v2();
//    }


//    @PostMapping("/app")
//    public Application createApp(@RequestBody Application app){
//        Application newApp= applicationRepo.save(app);
//        return newApp;
//    }
}
