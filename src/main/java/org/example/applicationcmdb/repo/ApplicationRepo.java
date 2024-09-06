package org.example.applicationcmdb.repo;

import org.example.applicationcmdb.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ApplicationRepo extends JpaRepository<Application,Long> {


    Application findApplicationByApplicationName(String applicationName);


}
