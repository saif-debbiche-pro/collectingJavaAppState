package org.example.applicationcmdb.service;


import jakarta.persistence.EntityManager;
import org.example.applicationcmdb.entity.*;
import org.example.applicationcmdb.enums.ChangeReason;
import org.example.applicationcmdb.enums.ChangeType;
import org.example.applicationcmdb.repo.ApplicationAuditRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuditService {




    @Autowired
    private ApplicationAuditRepo applicationAuditRepo;


    public DependencyAudit getDependencyAudit(Dependency dependency){
        return DependencyAudit.builder()
                .dependencyId(dependency.getId())
                .name(dependency.getName())
                .action(dependency.getAction())
                .version(dependency.getVersion())
                .build();
    }
    public List<ApplicationAudit> getAuditApp(Long appId){
        return applicationAuditRepo.findApplicationAuditByApplicationId(appId);
    }
    public ApplicationAudit getApplicationAudit(Application application, ChangeReason changeReason, ChangeType changeType){
        if(application.getPorts()==null) application.setPorts(new ArrayList<>());
        return ApplicationAudit.builder()
                .applicationId(application.getId())
                .changeType(changeType)
                .applicationName(application.getApplicationName())
                .applicationType(application.getApplicationType())
                .timestamp(Timestamp.valueOf(LocalDateTime.now()))
                .application_version(application.getApplication_version())
                .changeReason(changeReason)
                .ports(new ArrayList<>(application.getPorts()) )
                .dependencies(application.getDependencies().stream()
                .map(this::getDependencyAudit).toList())

                .build();

    }
    public ApplicationAudit createApplicationAudit(Application app, ChangeReason changeReason,ChangeType changeType){
        System.out.println("REACHING HERE 4");
        System.out.println(app.getDependencies());
        ApplicationAudit applicationAudit = getApplicationAudit(app,changeReason,changeType);
        System.out.println("REACHING HERE 5");
        System.out.println(applicationAudit.getDependencies());
        if (applicationAudit.getDependencies() != null) {
            for (DependencyAudit dependency : applicationAudit.getDependencies()) {
                dependency.setAppAudit(applicationAudit);
            }

        }
//          Unidirectional
//        if (applicationAudit.getBlockedDependencies() != null) {
//            for (DependencyAudit dependency : applicationAudit.getBlockedDependencies()) {
//                dependency.setAppAudit(applicationAudit);
//            }
//
//        }
        return applicationAuditRepo.save(applicationAudit);
    }


    public void deleteAppAudit(Long appId){
        applicationAuditRepo.deleteApplicationAuditByApplicationId(appId);
    }


}
