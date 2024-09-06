package org.example.applicationcmdb.repo;

import org.example.applicationcmdb.entity.OpenPort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.sound.sampled.Port;


@Repository
public interface PortRepo extends JpaRepository<OpenPort,Long> {
}
