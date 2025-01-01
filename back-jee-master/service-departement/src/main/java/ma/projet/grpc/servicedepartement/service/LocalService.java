package ma.projet.grpc.servicedepartement.service;

import ma.projet.grpc.servicedepartement.entity.Local;

import java.time.LocalDate;
import java.util.List;

public interface LocalService {
    List<Local> getAllLocaux();
    Local getLocalById(Long id);
    Local createLocal(Local local);
    Local updateLocal(Long id, Local local);
    void deleteLocal(Long id);

    List<Local> findDisponibles();
    List<Local> saveAll(List<Local> locaux);
}