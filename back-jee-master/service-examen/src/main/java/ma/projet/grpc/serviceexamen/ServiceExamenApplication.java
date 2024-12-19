package ma.projet.grpc.serviceexamen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ServiceExamenApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceExamenApplication.class, args);
	}

}
