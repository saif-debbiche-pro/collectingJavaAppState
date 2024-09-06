package org.example.applicationcmdb.entity;


import jakarta.persistence.*;
import lombok.*;
import org.example.applicationcmdb.enums.AppType;
import org.example.applicationcmdb.enums.ChangeReason;
import org.example.applicationcmdb.enums.ChangeType;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long applicationId;

    @Enumerated(EnumType.STRING)
    private AppType applicationType;


    private String applicationName;




    private ChangeReason changeReason;

    @Enumerated(EnumType.STRING)
    private ChangeType changeType;


    @Temporal(TemporalType.TIMESTAMP)
    private Timestamp timestamp;


    private String application_version;

    private String platformVersion;


    @OneToMany(mappedBy = "appAudit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DependencyAudit> dependencies;


    @OneToMany( cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OpenPort> ports;




}
