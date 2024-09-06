package org.example.applicationcmdb.dto;

import org.example.applicationcmdb.entity.Application;
import org.example.applicationcmdb.entity.ChangeAction;
import org.example.applicationcmdb.entity.Dependency;
import org.example.applicationcmdb.enums.ActionType;

import java.util.List;

public class Normalization {


    public static ApplicationReccord serializeApplicationToApplicationReccord(Application application){
        if(application==null) throw new RuntimeException("Application does not exist");
        return new ApplicationReccord(application.getApplicationType(), application.getApplicationName(), application.getApplication_version(),application.getNamespace(), application.getPlatformVersion(),Normalization.serializeDependencyListToDependencyReccordList(application.getDependencies()),application.getId(),application.getPorts(),serializeActionToActionReccord(application.getAction()));
    }

    public static ActionReccord serializeActionToActionReccord(ChangeAction changeAction){
        if(changeAction==null) return null;
        return new ActionReccord(changeAction.getActions());
    }

    public static ChangeAction serializeActionReccordToAction(ActionReccord actionReccord){
        if(actionReccord==null) return null;
        return  ChangeAction.builder()
                .actions(actionReccord.actions())
                .build();

    }


    public static DependencyReccord serializeDependencyToDependencyReccord(Dependency dependency){
        ActionType action=dependency.getAction();
        if(action==null) action=ActionType.ADD;
        return new DependencyReccord(dependency.getName() , dependency.getVersion(),action);
    }
    public static List<ApplicationReccord> serializeListApplicationToListApplicationReccord(List<Application> applications){
        return applications.stream().map(Normalization::serializeApplicationToApplicationReccord).toList();
    }
    public static List<DependencyReccord> serializeDependencyListToDependencyReccordList(List<Dependency> dependencies ){
        return dependencies.stream().map(Normalization::serializeDependencyToDependencyReccord).toList();
    }

    public static Application serializeApplicationReccordToApplication(ApplicationReccord applicationReccord ){
        return Application.builder()
                .application_version(applicationReccord.application_version())
                .applicationName(applicationReccord.applicationName())
                .applicationType(applicationReccord.applicationType())
                .platformVersion(applicationReccord.platformVersion())
                .ports(applicationReccord.ports())
                .action( serializeActionReccordToAction(applicationReccord.action()) )
                .dependencies(Normalization.serializeDependencyReccordListToDependencyList(applicationReccord.dependencies()) )
                .build()
                ;
    }


    public static Dependency serializeDependencyReccordToDependency(DependencyReccord dependencyReccord ){
        return Dependency.builder()
                .name(dependencyReccord.name())
                .version(dependencyReccord.version())
                .action(dependencyReccord.action()!=null?dependencyReccord.action():ActionType.ADD)
                .build();
    }

    public static List<Dependency> serializeDependencyReccordListToDependencyList(List<DependencyReccord> dependencyReccords ){
        return dependencyReccords.stream().map(Normalization::serializeDependencyReccordToDependency).toList();
    }



}
