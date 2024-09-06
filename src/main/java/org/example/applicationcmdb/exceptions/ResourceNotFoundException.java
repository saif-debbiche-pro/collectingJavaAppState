package org.example.applicationcmdb.exceptions;

import lombok.Data;

@Data
public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String resourse,Long id){
        super("No "+resourse+" found with id: "+id);
    }
    public ResourceNotFoundException(String message){
        super(message);
    }
}
