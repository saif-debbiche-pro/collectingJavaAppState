package org.example.applicationcmdb.service;


import org.example.applicationcmdb.dto.ApplicationReccord;
import org.example.applicationcmdb.dto.DependencyReccord;
import org.example.applicationcmdb.dto.Normalization;
import org.example.applicationcmdb.entity.*;
import org.example.applicationcmdb.enums.ChangeType;
import org.example.applicationcmdb.exceptions.DuplicateValueException;
import org.example.applicationcmdb.repo.ActionRepo;
import org.example.applicationcmdb.repo.ApplicationRepo;
import org.example.applicationcmdb.repo.PortRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.management.RuntimeErrorException;
import javax.sound.sampled.Port;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationRepo applicationRepo;
    @Autowired
    private DependencyService dependencyService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private PortRepo portRepo;

    @Autowired
    private ActionRepo actionRepo;




    public List<Application> getAll(){
        return applicationRepo.findAll();
    }

    public ApplicationReccord create(ApplicationReccord applicationReccord){


            Application application = Normalization.serializeApplicationReccordToApplication(applicationReccord);
            if (application.getDependencies() != null) {
                for (Dependency dependency : application.getDependencies()) {
                    dependency.setApp(application);
                }

            }

            if (applicationRepo.findApplicationByApplicationName(applicationReccord.applicationName()) != null) {
                throw new DuplicateValueException("application","name",applicationReccord.applicationName());
            }
            Application savedApp = applicationRepo.save(application);
            auditService.createApplicationAudit(application, null, ChangeType.CREATE);

            return applicationReccord;


    }

    public Application getApplication(Long applicationId){
        return applicationRepo.findById(applicationId).orElse(null);
    }

    @Transactional
    public Application updateActions(Long applicationId,String action){
        Application application= getApplication(applicationId);
        System.out.println("ACTIONS /");
        System.out.println(action);
        if(application!=null){
            if(application.getAction()!=null){
                actionRepo.deleteById(application.getAction().getId());
            }
            ChangeAction changeAction =ChangeAction.builder()
                    .actions(action)
                    .build();
            ChangeAction newAction= actionRepo.save(changeAction);
            application.setAction(newAction);
            return application;
        }else return null;

    }


    public Application getApplicationHistory(Long applicationId){
        return applicationRepo.findById(applicationId).orElse(null);
    }

    @Transactional
    public ApplicationReccord update(ApplicationReccord applicationReccord,Long applicationId){
        Application application = applicationRepo.findById(applicationId).orElse(null);
        if(application==null) throw new RuntimeException("No app with id: "+applicationId);

        application.setApplication_version(applicationReccord.application_version());
        application.setPlatformVersion(applicationReccord.platformVersion());
        application.setApplicationName(applicationReccord.applicationName());
        System.out.println(application);
        if(application.getAction()!=null){
            actionRepo.deleteById(application.getAction().getId());
            application.setAction(null);
        }
        if(applicationReccord.action()!=null){
            ChangeAction changeAction =Normalization.serializeActionReccordToAction(applicationReccord.action());
            ChangeAction action= actionRepo.save(changeAction);
            application.setAction(action);
        }

        application.setApplicationType(applicationReccord.applicationType());



        for(Dependency dep:application.getDependencies()){
            dependencyService.deleteDependency(dep.getId());
        }



//        for(OpenPort port:application.getPorts()){
//            portRepo.deleteById(port.getId());
//        }

        System.out.println("REACHING HERE");
        application.getDependencies().clear(); // Clear the existing collection
        application.getDependencies().addAll(Normalization.serializeDependencyReccordListToDependencyList(applicationReccord.dependencies()));





        application.getPorts().clear(); // Clear the existing collection

        List<OpenPort> newPorts=applicationReccord.ports().stream().map(port->OpenPort.builder().portNumber(port.getPortNumber()).protocol(port.getProtocol()).build()).toList();
        System.out.println(newPorts);
        application.getPorts().addAll(newPorts);

        for (Dependency dependency : application.getDependencies()) {
            dependency.setApp(application);
        }



        System.out.println("REACHING HERE  2");
        System.out.println(application);
        Application savedApp=applicationRepo.save(application);
        ApplicationAudit applicationAudit = auditService.createApplicationAudit(savedApp,null, ChangeType.UPDATE);


        return applicationReccord;
    }


    @Transactional
    public Boolean deleteApp(Long appId){
        applicationRepo.deleteById(appId);
        auditService.deleteAppAudit(appId);
        return true;
    }

}
