package ma.projet.grpc.serviceexamen.service;
import ma.projet.grpc.serviceexamen.entity.Module;
import java.util.List;

public interface ModuleService {
    Module createModule(Module module);
    Module updateModule(Long id, Module module);
    Module getModuleById(Long id);
    List<Module> getAllModules();
    void deleteModule(Long id);
    public List<Module> getModulesByOptionId(Long optionId);
}
