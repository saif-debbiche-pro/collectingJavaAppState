package org.example.applicationcmdb.repo;

import org.example.applicationcmdb.entity.ChangeAction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionRepo extends JpaRepository<ChangeAction,Long> {
}
