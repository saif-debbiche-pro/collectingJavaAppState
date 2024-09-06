package org.example.applicationcmdb.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.applicationcmdb.enums.ActionType;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DependencyAudit  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private Long dependencyId;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "app_audit_id")
    private ApplicationAudit appAudit;


    private ActionType action;
    private String version;
    private String name;



}
