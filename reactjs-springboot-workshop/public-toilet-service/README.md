# Public Toilet Service

This repository contains the backend service code for the Public Toilet App, a Spring Boot application that provides RESTful APIs for managing public toilets. This project is part of the ReactJS-SpringBoot Workshop conducted by [CertifySphere](https://certifysphere.com/).

For more details about the workshop, please refer to the [ReactJS-SpringBoot Workshop](https://certifysphere.com/docs/category/reactjs-springboot-workshop).

## Getting Started

To get started with the Public Toilet Service, follow the steps below:

### Prerequisites

- Java Development Kit (JDK) 11 or higher
- Maven

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/certifysphere/workshops.git
   ```

2. Navigate to the project directory:

   ```bash
   cd workshops/reactjs-springboot-workshop/public-toilet-service/
   ```

3. Build the project:

   ```bash
   ./mvnw clean package
   ```

### Usage

1. Run the service:

   ```bash
   ./mvnw spring-boot:run
   ```

   This will start the Public Toilet Service on a local server.

2. Access the service:

   The service will be accessible at `http://localhost:8080`.

### API Documentation

The Public Toilet Service provides the following RESTful APIs:

- `GET /api/toilets`: Retrieve a list of public toilets
- `GET /api/toilets/{id}`: Retrieve details of a specific public toilet
- `POST /api/toilets`: Create a new public toilet
- `PUT /api/toilets/{id}`: Update information for a public toilet
- `DELETE /api/toilets/{id}`: Delete a public toilet

For detailed API documentation and examples, please refer to the [API Documentation](https://certifysphere.com/docs/category/reactjs-springboot-workshop/api-docs).

### Database

The Public Toilet Service uses an H2 in-memory database for demonstration purposes. The database will be initialized with sample data when the service starts.

## Contributing

Contributions to the Public Toilet Service are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

The Public Toilet Service is built with Spring Boot and utilizes various open-source libraries and tools. Special thanks to the developers and contributors of these projects.

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [H2 Database](https://www.h2database.com/html/main.html)
- [Bootstrap](https://getbootstrap.com/)

## Contact

For any questions or inquiries, please contact [info@certifysphere.com](mailto:info@certifysphere.com).