package org.example.applicationcmdb.entity;


import jakarta.persistence.*;
import lombok.*;
import org.example.applicationcmdb.enums.AppType;

import java.util.ArrayList;
import java.util.List;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class Application {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;





    @Enumerated(EnumType.STRING)
    private AppType applicationType;


    private String applicationName;





    private String application_version;

    private String platformVersion;


    @OneToMany(mappedBy = "app", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dependency> dependencies;




    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<OpenPort> ports;


    @OneToOne(cascade = CascadeType.ALL)

    private ChangeAction action;


    private String namespace;







}
