package ma.projet.grpc.servicedepartement.service.impl;

import jakarta.transaction.Transactional;
import ma.projet.grpc.servicedepartement.entity.Local;
import ma.projet.grpc.servicedepartement.repository.LocalRepository;
import ma.projet.grpc.servicedepartement.service.LocalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class LocalServiceImpl implements LocalService {
    private final LocalRepository localRepository;

    @Autowired
    public LocalServiceImpl(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }
    public List<Local> getLocauxDisponibles(LocalDate date, String horaire) {
        return localRepository.findLocauxDisponibles(date, horaire);
    }

    @Override
    public List<Local> getAllLocaux() {
        return localRepository.findAll();
    }

    @Override
    public Local getLocalById(Long id) {
        return localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local non trouvé avec l'id: " + id));
    }
    @Override
    public Local createLocal(Local local) {
        return localRepository.save(local);
    }

    @Override
    public Local updateLocal(Long id, Local local) {
        Local existingLocal = getLocalById(id);
        existingLocal.setNom(local.getNom());
        existingLocal.setCapacite(local.getCapacite());
        existingLocal.setType(local.getType());
        existingLocal.setNbSurveillants(local.getNbSurveillants());
        existingLocal.setEstDisponible(local.isEstDisponible());
        return localRepository.save(existingLocal);
    }
    @Override
    public void deleteLocal(Long id) {
        localRepository.deleteById(id);
    }

    @Override
    public List<Local> findDisponibles(){
        return localRepository.findDisponibles();
    }
    public List<Local> saveAll(List<Local> locaux) {
        return localRepository.saveAll(locaux);
    }
}

