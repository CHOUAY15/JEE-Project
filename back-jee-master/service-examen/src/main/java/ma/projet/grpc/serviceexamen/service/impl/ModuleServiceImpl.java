package ma.projet.grpc.serviceexamen.service.impl;

import ma.projet.grpc.serviceexamen.repository.ModuleRepository;
import ma.projet.grpc.serviceexamen.service.ModuleService;
import ma.projet.grpc.serviceexamen.entity.Module;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }

    @Override
    public Module updateModule(Long id, Module module) {
        Optional<Module> existingModule = moduleRepository.findById(id);
        if (existingModule.isPresent()) {
            Module updatedModule = existingModule.get();
            updatedModule.setNom(module.getNom());
            updatedModule.setResponsableId(module.getResponsableId());
            updatedModule.setOption(module.getOption());
            return moduleRepository.save(updatedModule);
        }
        return null; // or throw an exception
    }

    @Override
    public Module getModuleById(Long id) {
        return moduleRepository.findById(id).orElse(null);
    }

    @Override
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    @Override
    public List<Module> getModulesByOptionId(Long optionId) {
        return moduleRepository.findByOptionId(optionId);
    }
    @Override
    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }
}
