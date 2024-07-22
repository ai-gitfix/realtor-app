# Realtor App: Building a Scalable Web Application with Nest.js, TypeScript, Prisma, and PostgreSQL

(POSTGRESQL IS CLOSED BECAUSE OF COSTS!)

## Overview

Welcome to my project, which leverages the power of Nest.js, TypeScript, Prisma, and PostgreSQL to build a robust and scalable web application. This project embodies modern development practices, utilizing a strong, typed language, an efficient backend framework, an ORM for database interaction, and a powerful relational database.

## Technology Stack

### 1. Nest.js

[Nest.js](https://nestjs.com/) is a progressive Node.js framework that serves as the foundation for building efficient and scalable server-side applications. It embraces modern design principles and enables the creation of well-organized, maintainable, and testable code.

### 2. TypeScript

[TypeScript](https://www.typescriptlang.org/) is a strongly typed superset of JavaScript that brings static typing to your development workflow. This enables better code quality, improved tooling, and enhanced developer productivity.

### 3. Prisma

[Prisma](https://www.prisma.io/) is a modern database toolkit that simplifies database access with an auto-generated query builder. It allows us to work with databases using a type-safe API, making database interactions more efficient and secure.

### 4. PostgreSQL

[PostgreSQL](https://www.postgresql.org/) is a powerful, open-source relational database system known for its extensibility, robustness, and support for various data types. It's an excellent choice for building scalable and reliable applications.

## Project Objectives

Our project aims to achieve the following objectives:

1. **Efficient Backend Development**: Utilize Nest.js to rapidly develop a backend with well-structured code and powerful features.

2. **Type-Safe Code**: Leverage TypeScript to ensure type safety throughout the application, minimizing runtime errors and providing an enhanced developer experience.

3. **Robust Database Interactions**: Utilize Prisma to handle database interactions seamlessly, ensuring optimal performance and reliable data management.

4. **Scalable Database Solution**: Utilize PostgreSQL as a scalable and robust relational database, enabling our application to handle data effectively as it grows.

5. **Maintainability and Readability**: Adhere to best practices and coding standards to ensure that the codebase is maintainable, easy to read, and scalable as the project evolves.


# Application Documentation

## Overview

This documentation provides an overview of a NestJS application that uses TypeScript, Prisma, and PostgreSQL. The application consists of two main services: the Authentication Service and the Home Management Service.

## Table of Contents

1. [Authentication Service](#authentication-service)
   - [Prerequisites](#prerequisites)
   - [Dependencies](#dependencies)
   - [Configuration](#configuration)
   - [Usage](#usage)
   - [Authentication Endpoints](#authentication-endpoints)
     - [Sign Up](#sign-up)
     - [Sign In](#sign-in)
     - [Generate Product Key](#generate-product-key)
2. [Home Management Service](#home-management-service)
   - [Overview](#overview)
   - [Dependencies](#dependencies-1)
   - [Configuration](#configuration-1)
   - [Usage](#usage-1)
   - [HomeController - Managing Homes](#homecontroller---managing-homes)
     - [Home Management Endpoints](#home-management-endpoints)
       - [Get Homes](#get-homes)
       - [Get Home by ID](#get-home-by-id)
       - [Create Home](#create-home)
       - [Update Home by ID](#update-home-by-id)
       - [Delete Home by ID](#delete-home-by-id)
       - [Inquire about a Home](#inquire-about-a-home)
       - [Get Messages for a Home](#get-messages-for-a-home)
     - [Guards and Decorators](#guards-and-decorators)
     - [Pipes](#pipes)
   - [Additional Notes](#additional-notes)

## Authentication Service

### Prerequisites

- This service uses [NestJS](https://nestjs.com/), a framework for building scalable and efficient server-side applications.

### Dependencies

- [Prisma](https://www.prisma.io/): Prisma is used for database operations.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs): bcryptjs is used for password hashing.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): jsonwebtoken is used for JWT (JSON Web Token) generation.

### Configuration

Ensure that you have the necessary environment variables configured, including the JWT secret and product secret.

### Usage

The authentication service provides several endpoints for user authentication and product key generation.

### Authentication Endpoints

#### Sign Up

- **Endpoint**: `/auth/signup/:userType`
- **Method**: `POST`
- **Description**: Sign up a new user with the provided credentials.
- **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "password123",
        "name": "John Doe",
        "phone": "123-456-7890",
        "productKey": "product_key"
    }
    ```
- **Response**: Returns a JWT token upon successful registration.

#### Sign In

- **Endpoint**: `/auth/signin`
- **Method**: `POST`
- **Description**: Sign in an existing user with their credentials.
- **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
- **Response**: Returns a JWT token upon successful authentication.

#### Generate Product Key

- **Endpoint**: `/auth/key`
- **Method**: `POST`
- **Description**: Generate a product key for users who want to sign up as an admin or realtor.
- **Request Body**:
    ```json
    {
        "email": "user@example.com",
        "userType": "ADMIN"
    }
    ```
- **Response**: Returns the generated product key.

## Home Management Service

### Overview

This section of the documentation covers the home management service in the NestJS application. This service allows users to perform operations related to home listings, including creation, retrieval, updating, and deletion.

### Dependencies

- This service relies on [Prisma](https://www.prisma.io/) for database operations.

### Configuration

Ensure that the necessary environment variables are configured for the home management service.

### Usage

The home management service provides endpoints for managing home listings, including filtering, creating, updating, deleting, and inquiring about homes.

### `HomeController` - Managing Homes

The `HomeController` is responsible for managing homes, including listing, creating, updating, and deleting homes. It also handles inquiries and message retrieval for realtors.

#### Home Management Endpoints

##### Get Homes

- **Endpoint**: `/home`
- **Method**: `GET`
- **Description**: Get a list of homes based on optional filters like city, price range, and property type.
- **Query Parameters**:
    - `city`: Filter by city name.
    - `minPrice`: Filter by minimum price.
    - `maxPrice`: Filter by maximum price.
    - `propertyType`: Filter by property type (e.g., HOUSE, APARTMENT).
- **Response**: Returns an array of `homeResponseDto` objects.

##### Get Home by ID

- **Endpoint**: `/home/:id`
- **Method**: `GET`
- **Description**: Get a specific home by its ID.
- **URL Parameter**:
    - `id`: The ID of the home to retrieve.
- **Response**: Returns a `homeResponseDto` object.

##### Create Home

- **Endpoint**: `/home`
- **Method**: `POST`
- **Description**: Create a new home listing.
- **Request Body**:
    ```json
    {
        "address": "123 Main St",
        "price": 250000,
        "land_size": 2000,
        "city": "Example City",
        "propertyType": "HOUSE",
        "bedroom": 3,
        "bathroom": 2,
        "images": [
            {"url": "image1.jpg"},
            {"url": "image2.jpg"}
        ]
    }
    ```
- **Response**: Returns a `homeResponseDto` object for the newly created home.

##### Update Home by ID

- **Endpoint**: `/home/:id`
- **Method**: `PUT`
- **Description**: Update an existing home listing by its ID.
- **URL Parameter**:
    - `id`: The ID of the home to update.
- **Request Body**: Fields to update (e.g., `address`, `price`, etc.).
- **Response**: Returns a `homeResponseDto` object for the updated home.

##### Delete Home by ID

- **Endpoint**: `/home/:id`
- **Method**: `DELETE`
- **Description**: Delete a home listing by its ID.
- **URL Parameter**:
    - `id`: The ID of the home to delete.
- **Response**: No content (204 No Content) on successful deletion.

##### Inquire about a Home

- **Endpoint**: `/home/inquire/:id`
- **Method**: `POST`
- **Description**: Send an inquiry message to the realtor of a specific home.
- **URL Parameter**:
    - `id`: The ID of the home to inquire about.
- **Request Body**:
    ```json
    {
        "message": "I'm interested in this property."
    }
    ```
- **Response**: Returns the inquiry message details.

##### Get Messages for a Home

- **Endpoint**: `/home/:id/messages`
- **Method**: `GET`
- **Description**: Retrieve messages related to a specific home. Only realtors can access this endpoint.
- **URL Parameter**:
    - `id`: The ID of the home to retrieve messages for.
- **Response**: Returns an array of messages, including buyer information.

#### Guards and Decorators

- The `@Roles` decorator is used to restrict access to certain endpoints based on the user's role (e.g., ADMIN, REALTOR, BUYER).
- The `@User` decorator is used to access user information (e.g., ID) for authenticated requests.
- The `@Roles` decorator and user roles are checked to enforce authorization for various actions.

#### Pipes

- The `ParseIntPipe` is used to parse and validate integer parameters.
- The `ValidationPipe` is used for request body validation, ensuring that the provided data adheres to the defined DTOs.

### Additional Notes

- Users who want to sign up as buyers do not need a product key.
- For admin and realtor sign-ups, a valid product key is required. The product key is generated using the provided email and user type and is hashed before validation.


## Conclusion

By combining the strengths of Nest.js, TypeScript, Prisma, and PostgreSQL, we are on the path to building a high-quality web application that meets our objectives of efficiency, type safety, robust database interactions, scalability, and maintainability.

P.S.: This document is written based on the sentence and document organization of ChatGPT.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

There are test cases written in home.service.spec.ts and home.controller.spec.ts. You can run and test these.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
