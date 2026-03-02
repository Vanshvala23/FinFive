<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

---

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository — a scalable and maintainable foundation for server-side applications.

---

## Project Setup

```bash
$ npm install
```

---

## Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## Users API

Base URL: `http://localhost:3000`

### Endpoints

#### 1. Get All Users

```http
GET /users
```

**Response** `200 OK`

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
]
```

---

#### 2. Get User by ID

```http
GET /users/:id
```

| Parameter | Type     | Description                  |
|-----------|----------|------------------------------|
| `id`      | `number` | **Required.** ID of the user |

**Response** `200 OK`

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 3. Create User

```http
POST /users
```

**Request Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

| Field      | Type     | Description              |
|------------|----------|--------------------------|
| `name`     | `string` | **Required.** Full name  |
| `email`    | `string` | **Required.** Email address |
| `password` | `string` | **Required.** Password   |

**Response** `201 Created`

```json
{
  "id": 3,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-03-02T00:00:00.000Z"
}
```

---

#### 4. Update User

```http
PATCH /users/:id
```

| Parameter | Type     | Description                  |
|-----------|----------|------------------------------|
| `id`      | `number` | **Required.** ID of the user |

**Request Body** *(all fields optional)*

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response** `200 OK`

```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### 5. Delete User

```http
DELETE /users/:id
```

| Parameter | Type     | Description                  |
|-----------|----------|------------------------------|
| `id`      | `number` | **Required.** ID of the user |

**Response** `200 OK`

```json
{
  "message": "User with ID 1 has been deleted successfully."
}
```

---

#### Error Responses

| Status Code | Description              |
|-------------|--------------------------|
| `400`       | Bad Request – Invalid input |
| `404`       | Not Found – User does not exist |
| `500`       | Internal Server Error    |

---

## Deployment

When you're ready to deploy your NestJS application to production, check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

Deploy effortlessly using [Mau](https://mau.nestjs.com), the official NestJS platform for AWS:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord Community](https://discord.gg/G7Qnnhy)
- [Official Courses](https://courses.nestjs.com/)
- [NestJS Mau – AWS Deployment](https://mau.nestjs.com)
- [NestJS Devtools](https://devtools.nestjs.com)
- [Enterprise Support](https://enterprise.nestjs.com)
- [Follow on X](https://x.com/nestframework) | [LinkedIn](https://linkedin.com/company/nestjs)
- [Jobs Board](https://jobs.nestjs.com)

---

## Support

Nest is an MIT-licensed open source project. It grows thanks to sponsors and amazing backers. [Read more here](https://docs.nestjs.com/support).

---

## Stay in Touch

- Author – [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website – [https://nestjs.com](https://nestjs.com/)
- Twitter – [@nestframework](https://twitter.com/nestframework)

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).