✂️ **Agendify API**

Agendify API is a backend application built with NestJS, created for study and learning purposes to practice and apply modern software architecture concepts such as:

🧱 Clean Architecture

🧠 Domain-Driven Design (DDD)

🧪 Test-Driven Development (TDD)

🔁 Best practices for modularity, testability, and maintainability

The project domain is barbershop service scheduling, used as a realistic scenario to explore architectural patterns in a real-world–like system. <br>

 **Project Goals**

This project is not intended for production use. Its main goals are:

- Apply Clean Architecture principles in a NestJS application
- Model the domain using DDD concepts
- Develop business rules using TDD
- Ensure low coupling and high cohesion

Make the system easy to test, refactor, and evolve

**Features**
- User registration and login
- Create a barbershops
- Create services offered by barbershops
- Create customer
- Createand cancel appointments

**Architecture**

The project follows Clean Architecture principles, keeping the core domain independent from frameworks and external details.

**Key Principles**

- Dependencies always point towards the domain
- Business rules do not depend on frameworks, databases, or delivery mechanisms
- Use cases represent application intentions
- Infrastructure is treated as a replaceable detail
  
The project is modular, and each module encapsulates its own domain and use cases.

**Testing (TDD)**

The project is designed to be developed using Test-Driven Development (TDD). <br><br>
