package org.example.applicationcmdb.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeAction {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

    @Column(columnDefinition = "TEXT")
private String actions;

}
