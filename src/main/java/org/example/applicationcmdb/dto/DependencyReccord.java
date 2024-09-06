package org.example.applicationcmdb.dto;

import org.example.applicationcmdb.enums.ActionType;

public record DependencyReccord(String name, String version, ActionType action) {
}
