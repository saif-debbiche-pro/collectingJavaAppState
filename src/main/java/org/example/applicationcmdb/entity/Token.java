package org.example.applicationcmdb.entity;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Token {
       @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @Column(columnDefinition = "longtext")
        private String token;

        private boolean expired;
        private boolean revoked;
        private Timestamp createdAt ;

        @ManyToOne
        private User user;
    }






