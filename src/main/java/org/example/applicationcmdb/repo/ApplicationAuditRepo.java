package org.example.applicationcmdb.repo;

import org.example.applicationcmdb.entity.ApplicationAudit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationAuditRepo extends JpaRepository<ApplicationAudit,Long> {

    List<ApplicationAudit> findApplicationAuditByApplicationId(Long applicationId);


    void deleteApplicationAuditByApplicationId(Long applicationId);
}
