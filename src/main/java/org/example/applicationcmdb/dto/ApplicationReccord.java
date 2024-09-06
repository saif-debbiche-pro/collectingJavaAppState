package org.example.applicationcmdb.dto;

import org.example.applicationcmdb.entity.ChangeAction;
import org.example.applicationcmdb.entity.OpenPort;
import org.example.applicationcmdb.enums.AppType;

import java.util.ArrayList;
import java.util.List;

public record ApplicationReccord(AppType applicationType, String applicationName, String application_version,String namespace, String platformVersion, List<DependencyReccord> dependencies , Long id, List<OpenPort> ports,
                                 ActionReccord action) {
}
