package org.example.applicationcmdb.exceptions;

public class DuplicateValueException extends RuntimeException{
    public DuplicateValueException(String resource,String field,String duplicateValue){
        super(resource+" with "+field+"= '"+duplicateValue+"' exist in the database");
    }
}
