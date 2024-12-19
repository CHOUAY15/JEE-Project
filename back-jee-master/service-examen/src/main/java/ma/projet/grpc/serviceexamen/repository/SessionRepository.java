package ma.projet.grpc.serviceexamen.repository;

import ma.projet.grpc.serviceexamen.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {

}
