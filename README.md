# Système de Surveillance des Examens - ENSA El Jadida

Application web de gestion et planification des surveillances d'examens pour l'École Nationale des Sciences Appliquées d'El Jadida.

## 🚀 Fonctionnalités

- Gestion des départements et enseignants
- Planification des sessions d'examens
- Attribution automatique des surveillances
- Gestion des locaux (amphithéâtres et salles)
- Système de réservistes
- Génération de plannings de surveillance

## 🛠 Architecture
![WhatsApp Image 2025-01-05 à 15 28 29_000f4f33](https://github.com/user-attachments/assets/2e48b461-7302-44e0-a434-67cbd225a190)

### Frontend
- React.js
- Redux pour la gestion d'état
- Axios pour les appels API
- Interface responsive et moderne

### Backend
- Architecture microservices avec Spring Boot
- Services :
  - Service des Examens
  - Service des Départements
- API Gateway
- Eureka Server pour la découverte de services
- Keycloak pour l'authentification

### Base de données
- MySQL pour chaque service

## 📋 Prérequis

- Node.js (v14+)
- Java 17
- Maven
- MySQL
- Docker & Docker Compose
- Keycloak

## 🚀 Installation

### Configuration du Frontend

```bash
# Cloner le repository
git clone https://github.com/CHOUAY15/JEE-Project.git

# Accéder au dossier frontend
cd material-tailwind-dashboard-react-main

# Installer les dépendances
npm install

# Lancer l'application en développement
npm start
```

### Configuration du Backend

```bash
# Accéder au dossier du service
cd [service-name]

# Compiler avec Maven
mvn clean install

# Lancer le service
mvn spring-boot:run
```

### Configuration de Keycloak

1. Lancer Keycloak
```bash
docker-compose up keycloak
```

2. Créer un realm
3. Configurer le client
4. Ajouter les rôles et utilisateurs

## 🔑 Configuration

### Variables d'environnement Frontend
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_KEYCLOAK_URL=http://localhost:8180
REACT_APP_KEYCLOAK_REALM=your-realm
REACT_APP_KEYCLOAK_CLIENT_ID=your-client-id
```

### Configuration des Services
```yaml
server:
  port: 8080

spring:
  application:
    name: exam-service
  datasource:
    url: jdbc:mysql://localhost:3306/exam_db
    username: root
    password: root
```


## 👥 Contributeurs

- CHOUAY Walid
- BESSAM Adam
- DAOUDI Mohammed

## 📄 Licence

Ce projet est la propriété de l'ENSA El Jadida. Tous droits réservés.
