package org.example.applicationcmdb.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.applicationcmdb.enums.ProtocolType;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpenPort {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @Enumerated(EnumType.STRING)
    private ProtocolType protocol;



    private Integer portNumber;




}
