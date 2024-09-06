package org.example.applicationcmdb.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements Serializable, UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id ;

    private String firstName;

    private String lastName;
    //private String priv ="normal";

    private String email;

    private String password;



    private boolean notLocker=true;


    @Temporal(TemporalType.DATE)
    @Column( nullable = true)
    private Date LockedDate;

    private String secret;


    @Column(nullable = true)
    private String picture;

    @Temporal(TemporalType.DATE)
    @Column(name = "created_date"/*, nullable = false, updatable = false*/)
    private Date createdDate = new Date();

    @Enumerated(EnumType.STRING)
    private RoleType role=RoleType.USER;
    private boolean enable;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Token> tokensAuth;










    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return notLocker;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enable;
    }
}




