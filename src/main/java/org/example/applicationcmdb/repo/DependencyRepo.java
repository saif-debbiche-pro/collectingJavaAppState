package org.example.applicationcmdb.repo;


import org.example.applicationcmdb.entity.Dependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DependencyRepo extends JpaRepository<Dependency,Long> {
}
