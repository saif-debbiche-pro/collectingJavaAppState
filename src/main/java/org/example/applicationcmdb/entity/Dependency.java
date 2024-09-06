package org.example.applicationcmdb.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.applicationcmdb.enums.ActionType;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class Dependency  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;


    private ActionType action;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "app_id")
    private Application app;

    private String version;









}
