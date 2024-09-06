package org.example.applicationcmdb.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.example.applicationcmdb.entity.RoleType;
import org.example.applicationcmdb.entity.Token;

import java.util.Date;
import java.util.List;
@Data
public class UserReccord {
    Long id ;

    private String firstName;

    private String lastName;
    //private String priv ="normal";

    private String email;

    private String password;

}
