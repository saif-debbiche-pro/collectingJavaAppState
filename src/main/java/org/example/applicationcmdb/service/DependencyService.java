package org.example.applicationcmdb.service;


import org.example.applicationcmdb.entity.Dependency;
import org.example.applicationcmdb.repo.DependencyRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DependencyService {

@Autowired
private DependencyRepo dependencyRepo;


public Dependency save(Dependency dependency){
    return dependencyRepo.save(dependency);
}

public void deleteDependency(Long id){
    dependencyRepo.deleteById(id);
}

}
