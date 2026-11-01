# US-34 — Recuperar contraseña (Backend)

> Spec generado a partir de la exploración real de `TetraCodeTeam/knowlink-backend`, rama `dev` (commit `0724205`). Pensado para ejecutarse con **OpenCode + DeepSeek V4 Flash**: pasos literales, rutas exactas y verificación por paso. No improvises fuera de lo que dice este documento.

## Antes de empezar (obligatorio)

1. Leer `AGENTS.md` y `docs/base-standards.md` del repo (estructura de paquetes, inyección por constructor, DTOs como `record`, mensajes de validación Jakarta en inglés, mensajes al usuario y Swagger en español, `@Slf4j`, nunca `Optional.get()`).
2. Crear la rama desde `dev`: `git checkout dev && git pull && git checkout -b feat/password-recovery`.
3. Correr la línea base **antes de tocar nada**: `./mvnw test -q`. Si ya falla, anotarlo y NO arreglarlo en esta historia.
4. Trabajar en este orden exacto: **enum → constantes → entidad `Token` → migración → repository → token service → request DTOs → user service → email → docs Swagger del controller → tests**.

## Metadata

| Campo | Valor |
|---|---|
| ID Historia | US-34 |
| Épica | — |
| Story Points | 3 |
| Prioridad | Baja |
| Módulo | usuarios |
| Repo / rama | `knowlink-backend`, rama `feat/password-recovery` (base = `dev`) |
| Relacionadas | US-02 (inicio de sesión), US-01 y US-42 (requisitos de contraseña) |
| Spec hermano | `us-34-recuperar-contrasena-frontend.spec.md` (repo `knowlink-frontend`) |

## Historia de usuario

Como usuario registrado, quiero poder restablecer mi contraseña desde la pantalla de login en caso de olvidarla, para recuperar el acceso a mi cuenta sin necesitar intervención del equipo de soporte.

Descripción adicional: flujo de recuperación de contraseña por email.

## Alcance backend

**El backend ya tiene un flujo de reset a medio hacer** (ver "Hechos verificados"). Esta historia NO crea los endpoints: los **endurece** para cumplir los criterios. El criterio 1 (opción en el login) es solo de UI y vive en el spec del frontend.

| CA | Qué hace el backend | Brecha actual en `dev` |
|---|---|---|
| 2 | `POST /reset-password/email` responde **siempre 204**, exista o no la cuenta; solo envía mail si la cuenta existe y está ACTIVE | Hoy responde 404 `USER_NOT_FOUND` si no existe y 429 si hay exceso de pedidos → **revela qué correos están registrados** |
| 3 | El token de reset vence a los **30 minutos** | Hoy `Token.onCreate` fija **24 horas** para todos los tokens |
| 4 | Valida la nueva contraseña con las mismas reglas del registro | Hoy `ResetPasswordRequest` **no tiene ninguna validación** (campos nulos → `NullPointerException`; cualquier contraseña es aceptada) |
| 5 | Tras restablecer, todos los enlaces de reset del usuario quedan invalidados (un solo uso) | Hoy borra todos los tokens del usuario (sirve), pero sin lock → dos envíos simultáneos podrían usar el mismo enlace |
| 6 | Enlace usado, vencido, inexistente o malformado → siempre el mismo error con el mensaje `Este enlace ya no es válido. Solicitá uno nuevo` | Hoy hay dos mensajes distintos (404 "El enlace ya no es válido." / 401 "El enlace ha expirado. Por favor, solicita uno nuevo"); el 401 además hace que el frontend cierre sesión |
| — | Los tokens de reset y de confirmación de cuenta **no se pueden intercambiar** | Hoy comparten tabla sin distinguir tipo: un token de confirmación sirve para resetear la contraseña y uno de reset sirve para activar la cuenta |

## Criterios de aceptación (Gherkin)

```gherkin
Feature: Recuperar contraseña (backend)

  Background:
    Given existe un usuario ACTIVE con email "ana@test.com"

  # CA 2
  Scenario: Solicitud con correo registrado
    When POST /api/v1/users/reset-password/email con {"email":"ana@test.com"} sin autenticación
    Then responde 204 sin cuerpo
    And se crea un token de tipo PASSWORD_RESET para el usuario
    And se publica PasswordResetRequestedEvent (el mail sale async después del commit)

  Scenario: Solicitud con correo no registrado
    When POST /api/v1/users/reset-password/email con {"email":"nadie@test.com"}
    Then responde 204 sin cuerpo (idéntico al caso anterior)
    And no se crea ningún token ni se publica ningún evento

  Scenario: Cuenta sin confirmar
    Given un usuario INACTIVE
    When solicita el reset
    Then responde 204 sin crear token ni publicar evento

  Scenario: Demasiadas solicitudes
    Given el usuario ya tiene 3 tokens PASSWORD_RESET creados en la última hora
    When solicita el reset otra vez
    Then responde 204 (NO 429) sin crear token ni publicar evento

  Scenario: Formato de email inválido o vacío
    When POST con {"email":""} o {"email":"abc"}
    Then responde 400 con detail "VALIDATION_ERROR"

  # CA 3
  Scenario: Vigencia del token
    When se emite un token PASSWORD_RESET
    Then su vencimiento es creación + 30 minutos
    And el token de confirmación de cuenta sigue venciendo a las 24 horas

  # CA 4 y 5
  Scenario: Restablecer con enlace válido
    Given un token PASSWORD_RESET vigente del usuario
    When POST /api/v1/users/reset-password con {"token":"<uuid>","newPassword":"Nueva#123","confirmNewPassword":"Nueva#123"}
    Then responde 204
    And la contraseña del usuario queda cifrada con la nueva
    And todos los tokens PASSWORD_RESET del usuario se eliminan

  Scenario Outline: Contraseña que no cumple los requisitos
    When se envía newPassword "<valor>" con un token vigente
    Then responde 400 con detail "VALIDATION_ERROR"
    And la contraseña NO cambia y el token sigue vigente
    Examples:
      | valor     | motivo              |
      | Ab#1      | menos de 8          |
      | nueva#123 | sin mayúscula       |
      | NUEVA#123 | sin minúscula       |
      | Nueva1234 | sin carácter especial |

  Scenario: Las contraseñas no coinciden
    When newPassword y confirmNewPassword difieren
    Then responde 400 con detail "PASSWORDS_MISMATCH"
    And el token sigue vigente

  # CA 5 y 6
  Scenario Outline: Enlace no utilizable
    When se envía un token <caso>
    Then responde 422 con message "Este enlace ya no es válido. Solicitá uno nuevo" y detail "RESET_LINK_INVALID"
    And la contraseña NO cambia
    Examples:
      | caso                                        |
      | ya utilizado                                |
      | vencido                                     |
      | inexistente (UUID aleatorio)                |
      | malformado ("abc")                          |
      | de tipo ACCOUNT_CONFIRMATION                |
      | de un usuario que ya no está ACTIVE         |

  Scenario: Un token de reset no activa cuentas
    Given un token PASSWORD_RESET de un usuario INACTIVE
    When POST /api/v1/users/{userId}/verify-account con ese token
    Then responde 404 TOKEN_NOT_FOUND y la cuenta sigue INACTIVE
```

## Hechos verificados en el código (no re-investigar)

- **Endpoints ya existentes** en `com.knowlink.api.users.controllers.interfaces.IUserController` (`@RequestMapping("/api/v1/users")`): `POST /reset-password/email` (`sendResetPasswordEmail(@RequestBody @Valid EmailRequest)`, 204) y `POST /reset-password` (`resetPassword(@RequestBody @Valid ResetPasswordRequest)`, 204). `UserControllerImpl` solo delega en `IUserService`. **No tienen `@Operation`/`@ApiResponse`** (AGENTS.md los exige).
- **Seguridad**: `SecurityConstants.PUBLIC_WHITELIST` ya incluye `"/api/v1/users/reset-password/**"` → ambos endpoints son públicos. **No tocar `SecurityConfig` ni `SecurityConstants`** (ver nota en "No hacer" si el test de CA 1 falla).
- **Flujo de mail ya existente**: `UserServiceImpl.sendResetPasswordEmail` publica `PasswordResetRequestedEvent(User user, UUID tokenId)` → `UserNotificationListener.handlePasswordReset` (`@Async("taskExecutor") @TransactionalEventListener(AFTER_COMMIT)`) → `EmailServiceImpl.sendResetPasswordEmail` → `EmailBuilder.buildResetPassword`, que arma el link `${frontend.url}/auth/reset-password?token=<uuid>`. **No cambiar esa ruta del link** (el frontend la implementa con ese path exacto). Como el envío es asíncrono y posterior al commit, la latencia de la respuesta no depende de si el mail se envía.
- **`Token`** (`com.knowlink.api.users.data.models.Token`, tabla `tokens`): campos `tokenId` (UUID, `GenerationType.UUID`), `createdAt`, `tokenExpirationDate` (`token_expiration_date`, not null), `user` (`@ManyToOne LAZY`). `@PrePersist onCreate()` **sobrescribe siempre** `tokenExpirationDate = now + 24h`. Tiene `@Builder`. No tiene tipo.
- **`ITokenRepository`**: `findByTokenId`, `findFirstByUserOrderByCreatedAtDesc`, `countByUserAndCreatedAtAfter`, `deleteAllByUser`. `ITokenService`/`TokenServiceImpl`: `saveUserToken(User)`, `findByTokenOrThrowException(UUID)` (404 `TOKEN_NOT_FOUND` "El enlace ya no es válido."), `findLatestTokenByUser`, `canResendToken(User)`, `deleteTokensByUser(User)`. `Constants` (`users.utils`): `HOURS_LIMIT = 1`, `MAX_TOKENS_PER_HOUR = 3`.
- **Quién usa `findByTokenOrThrowException`**: `UserServiceImpl.verifyNewUser` (confirmación de cuenta) y `UserServiceImpl.resetPassword`. Verificar con `grep -rn "findByTokenOrThrowException" src` antes de cambiarlo.
- **`UserServiceImpl`** (`users.services.implementations`): inyecta `IUserRepository userRepository`, `UserMapper`, `PasswordEncoder passwordEncoder`, `ITokenService tokenService`, `IUserValidationService userValidationService`, `ApplicationEventPublisher eventPublisher` (`@RequiredArgsConstructor`). No tiene `@Slf4j`.
- **`IUserRepository.findByEmail(String)`** ya excluye cuentas `DELETED` (`accountStatus != 'DELETED'`). `AccountStatus`: `ACTIVE`, `INACTIVE`, `DELETED`.
- **Reglas de contraseña del registro** (`StudentRegistrationRequest` y `TutorRegistrationRequest`): `@NotBlank` + `@Size(min = 8)` + `@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$", message = "Password does not meet minimum security requirements")`. "Carácter especial" = cualquier no alfanumérico. **No se exige dígito.**
- **Errores**: `ApiError(int status, String message, String detail)`. `UnprocessableEntityException(errorCode, userMessage, technicalMessage)` → `GlobalExceptionHandler` responde **422** con `message = userMessage` y `detail = errorCode`. `MethodArgumentNotValidException` → 400 con `message = "campo: mensaje, ..."` y `detail = "VALIDATION_ERROR"`. `PasswordsDoNotMatchException` → 400 `message = "Las contraseñas no coinciden"`, `detail = "PASSWORDS_MISMATCH"`. `HttpMessageNotReadableException` → 400. `TokenExpiredException` → 401 (**no usarla en el reset**: el 401 hace que el frontend cierre sesión).
- **Esquema**: Hibernate con `DDL_AUTO` (en `docker-compose.yml` = `update`; los tests usan H2 `create-drop`). El repo guarda scripts manuales `src/main/resources/migration-*.sql` idempotentes (ver `migration-user-first-last-name.sql` como modelo de estilo).
- **Tests**: patrón de `StudentProfileUpdateControllerTest` (`@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Transactional`). En un test `@Transactional` el listener `AFTER_COMMIT` **nunca se ejecuta** (rollback) → no se envía ningún mail ni hace falta mockear `JavaMailSender`; los eventos se verifican con `@RecordApplicationEvents`.
- `AuthServiceImplTest` está comentado entero; no lo uses ni lo reactives.

## Diseño de los endpoints

### `POST /api/v1/users/reset-password/email` (público)

| | |
|---|---|
| Request | `{"email": "ana@test.com"}` |
| 204 | Siempre que el body sea válido: cuenta existente, inexistente, INACTIVE o con límite excedido |
| 400 | `email` vacío o con formato inválido (`detail = VALIDATION_ERROR`) |

### `POST /api/v1/users/reset-password` (público)

| | |
|---|---|
| Request | `{"token": "<uuid>", "newPassword": "...", "confirmNewPassword": "..."}` (`token` pasa a `String`) |
| 204 | Contraseña actualizada y enlaces de reset invalidados |
| 400 | Body inválido / contraseña débil (`VALIDATION_ERROR`) o no coinciden (`PASSWORDS_MISMATCH`) |
| 422 | Enlace usado/vencido/inexistente/malformado/de otro tipo → `message = "Este enlace ya no es válido. Solicitá uno nuevo"`, `detail = "RESET_LINK_INVALID"` |

Orden de validación en `resetPassword`: (1) Bean Validation del body → 400; (2) token válido (formato, existe, es PASSWORD_RESET, no vencido, usuario ACTIVE) → 422; (3) coincidencia de contraseñas → 400. Así un enlace inválido siempre muestra el mensaje del CA 6.

## Archivos a crear / modificar

Todos los paths son relativos a `src/main/java/com/knowlink/api/` salvo indicación.

### 1. `users/data/enums/TokenType.java` (CREAR)

```java
package com.knowlink.api.users.data.enums;

public enum TokenType {
    ACCOUNT_CONFIRMATION,
    PASSWORD_RESET
}
```

### 2. `users/utils/Constants.java` (MODIFICAR)

Agregar (sin tocar `HOURS_LIMIT` ni `MAX_TOKENS_PER_HOUR`):

```java
public static final int ACCOUNT_CONFIRMATION_TOKEN_HOURS = 24;
public static final int PASSWORD_RESET_TOKEN_MINUTES = 30;

/** Same rule as registration (StudentRegistrationRequest / TutorRegistrationRequest): lower, upper and a special character. */
public static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$";

public static final String RESET_LINK_INVALID_CODE = "RESET_LINK_INVALID";
public static final String RESET_LINK_INVALID_MESSAGE = "Este enlace ya no es válido. Solicitá uno nuevo";
```

No refactorizar los requests de registro para usar `PASSWORD_REGEX` (los toca US-42).

### 3. `users/data/models/Token.java` (MODIFICAR)

Agregar el campo (con los imports de `TokenType` y `static ...Constants.ACCOUNT_CONFIRMATION_TOKEN_HOURS`):

```java
@Enumerated(EnumType.STRING)
@Column(name = "token_type", nullable = false, length = 30,
        columnDefinition = "VARCHAR(30) NOT NULL DEFAULT 'ACCOUNT_CONFIRMATION'")
@Builder.Default
private TokenType tokenType = TokenType.ACCOUNT_CONFIRMATION;
```

El `columnDefinition` con `DEFAULT` es obligatorio: con `DDL_AUTO=update` Hibernate agrega la columna a una tabla con filas existentes y estas deben quedar como `ACCOUNT_CONFIRMATION`.

Reemplazar `onCreate()` por (ya no pisa un vencimiento seteado por el servicio):

```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    if (tokenExpirationDate == null) {
        tokenExpirationDate = createdAt.plusHours(ACCOUNT_CONFIRMATION_TOKEN_HOURS);
    }
}
```

### 4. `src/main/resources/migration-token-type.sql` (CREAR)

Script idempotente para entornos con `DDL_AUTO=none|validate`, mismo estilo que `migration-user-first-last-name.sql`:

```sql
-- =============================================
-- KnowLink - US-34 migration
-- Adds tokens.token_type (ACCOUNT_CONFIRMATION | PASSWORD_RESET).
--
-- Run once BEFORE deploying the version that maps the column:
--   mysql --default-character-set=utf8mb4 -u <user> -p <database> < migration-token-type.sql
--
-- Existing rows become ACCOUNT_CONFIRMATION (the only type that existed).
-- Safe to re-run. The tokens table must already exist.
-- =============================================

SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'tokens'
      AND COLUMN_NAME = 'token_type'
);

SET @ddl = IF(@column_exists = 0,
    'ALTER TABLE tokens ADD COLUMN token_type VARCHAR(30) NOT NULL DEFAULT ''ACCOUNT_CONFIRMATION''',
    'SELECT 1');

PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'tokens'
  AND COLUMN_NAME = 'token_type';
```

### 5. `users/repositories/ITokenRepository.java` (MODIFICAR)

Agregar (conservar los métodos existentes). Imports: `TokenType`, `jakarta.persistence.LockModeType`, `org.springframework.data.jpa.repository.Lock`, `Query`, `org.springframework.data.repository.query.Param`.

```java
Optional<Token> findByTokenIdAndTokenType(UUID tokenId, TokenType tokenType);

@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT t FROM Token t WHERE t.tokenId = :tokenId AND t.tokenType = :tokenType")
Optional<Token> findByTokenIdAndTokenTypeForUpdate(@Param("tokenId") UUID tokenId,
                                                   @Param("tokenType") TokenType tokenType);

long countByUserAndTokenTypeAndCreatedAtAfter(User user, TokenType tokenType, LocalDateTime dateTime);

void deleteAllByUserAndTokenType(User user, TokenType tokenType);
```

### 6. `users/services/interfaces/ITokenService.java` + `implementations/TokenServiceImpl.java` (MODIFICAR)

Interfaz — agregar:

```java
Token savePasswordResetToken(User user);

Optional<Token> findPasswordResetTokenForUpdate(UUID tokenId);

boolean canIssuePasswordResetToken(User user);

void deletePasswordResetTokensByUser(User user);
```

Implementación — agregar:

```java
@Override
public Token savePasswordResetToken(User user) {
    Token token = Token.builder()
            .user(user)
            .tokenType(TokenType.PASSWORD_RESET)
            .tokenExpirationDate(LocalDateTime.now().plusMinutes(PASSWORD_RESET_TOKEN_MINUTES))
            .build();
    return tokenRepository.save(token);
}

@Override
public Optional<Token> findPasswordResetTokenForUpdate(UUID tokenId) {
    return tokenRepository.findByTokenIdAndTokenTypeForUpdate(tokenId, TokenType.PASSWORD_RESET);
}

@Override
public boolean canIssuePasswordResetToken(User user) {
    LocalDateTime hoursLimit = LocalDateTime.now().minusHours(HOURS_LIMIT);
    long recent = tokenRepository.countByUserAndTokenTypeAndCreatedAtAfter(
            user, TokenType.PASSWORD_RESET, hoursLimit);
    return recent < MAX_TOKENS_PER_HOUR;
}

@Override
public void deletePasswordResetTokensByUser(User user) {
    tokenRepository.deleteAllByUserAndTokenType(user, TokenType.PASSWORD_RESET);
}
```

Y **modificar** `findByTokenOrThrowException` para que solo encuentre tokens de confirmación (impide activar una cuenta con un token de reset):

```java
return tokenRepository.findByTokenIdAndTokenType(tokenId, TokenType.ACCOUNT_CONFIRMATION)
        .orElseThrow(() -> new ResourceNotFoundException( ...igual que hoy... ));
```

`saveUserToken(User)` **no cambia** (crea `ACCOUNT_CONFIRMATION`, vence a 24 h por el `@PrePersist`). Agregar los imports estáticos de `PASSWORD_RESET_TOKEN_MINUTES` y el import de `Optional` y `TokenType`.

### 7. `users/controllers/requests/EmailRequest.java` (MODIFICAR)

```java
public record EmailRequest (
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email
) {}
```

(También lo usa `resend-verification-account`: el `@NotBlank` solo mejora ese caso, que hoy con `null` no tiene validación.)

### 8. `users/controllers/requests/ResetPasswordRequest.java` (MODIFICAR)

```java
package com.knowlink.api.users.controllers.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import static com.knowlink.api.users.utils.Constants.PASSWORD_REGEX;

public record ResetPasswordRequest(
        @NotBlank(message = "Token is required")
        String token,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(regexp = PASSWORD_REGEX,
                message = "Password does not meet minimum security requirements")
        String newPassword,

        @NotBlank(message = "Password confirmation is required")
        String confirmNewPassword
) {}
```

`token` pasa de `UUID` a `String` a propósito: un token malformado debe terminar en el 422 del CA 6 y no en un 400 genérico de deserialización.

### 9. `users/services/interfaces/IUserService.java` (MODIFICAR)

Cambiar la firma a `void resetPassword(String token, String newPassword, String confirmNewPassword);`. `sendResetPasswordEmail(String email)` no cambia. `UserControllerImpl.resetPassword` no necesita cambios (`resetPasswordRequest.token()` ahora devuelve `String`).

### 10. `users/services/implementations/UserServiceImpl.java` (MODIFICAR)

Agregar `@Slf4j` (import `lombok.extern.slf4j.Slf4j`) y reemplazar **solo** los métodos `resetPassword` y `sendResetPasswordEmail` por:

```java
@Override
@Transactional
public void resetPassword(String rawToken, String newPassword, String confirmNewPassword) {
    UUID tokenId = parseResetTokenOrThrow(rawToken);

    Token resetToken = tokenService.findPasswordResetTokenForUpdate(tokenId)
            .orElseThrow(() -> invalidResetLink("token inexistente, ya utilizado o de otro tipo"));

    if (resetToken.getTokenExpirationDate().isBefore(LocalDateTime.now())) {
        throw invalidResetLink("token de reset vencido");
    }

    User user = resetToken.getUser();
    if (user.getAccountStatus() != AccountStatus.ACTIVE) {
        throw invalidResetLink(String.format("usuario '%s' no está activo", user.getUserId()));
    }

    userValidationService.verifyIfPasswordsMatch(newPassword, confirmNewPassword);

    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    tokenService.deletePasswordResetTokensByUser(user);
}

@Override
@Transactional
public void sendResetPasswordEmail(String email) {
    // Never reveal whether the account exists: every branch returns normally.
    userRepository.findByEmail(email.trim()).ifPresentOrElse(
            this::issuePasswordResetToken,
            () -> log.info("Password reset requested for an unregistered email"));
}

private void issuePasswordResetToken(User user) {
    if (user.getAccountStatus() != AccountStatus.ACTIVE) {
        log.info("Password reset ignored for non-active userId '{}'", user.getUserId());
        return;
    }
    if (!tokenService.canIssuePasswordResetToken(user)) {
        log.warn("Password reset rate limit reached for userId '{}'", user.getUserId());
        return;
    }
    Token token = tokenService.savePasswordResetToken(user);
    eventPublisher.publishEvent(new PasswordResetRequestedEvent(user, token.getTokenId()));
}

private UUID parseResetTokenOrThrow(String rawToken) {
    try {
        return UUID.fromString(rawToken.trim());
    } catch (IllegalArgumentException ex) {
        throw invalidResetLink("token con formato inválido");
    }
}

private UnprocessableEntityException invalidResetLink(String technicalMessage) {
    return new UnprocessableEntityException(
            RESET_LINK_INVALID_CODE, RESET_LINK_INVALID_MESSAGE, technicalMessage);
}
```

Imports a agregar: `java.time.LocalDateTime`, `static com.knowlink.api.users.utils.Constants.RESET_LINK_INVALID_CODE` y `RESET_LINK_INVALID_MESSAGE`. `UnprocessableEntityException` ya entra por `exceptions.custom_exceptions.*`. Importante:

- **No loguear el email ni el token** (datos sensibles): solo `userId`.
- `findUserByEmailOrThrowException` **se conserva** (lo usa `resendConfirmationEmail`); simplemente deja de usarse en el reset.
- `validateResendLimit` y `validateTokenNotExpired` **no se tocan** (los sigue usando la confirmación de cuenta).

### 11. `users/builder/EmailBuilder.java` (MODIFICAR)

En `buildResetPassword`, cambiar el texto del cuerpo para informar la vigencia (el link no cambia):

```java
"Recibimos una solicitud para restablecer la contraseña de tu cuenta de Knowlink. "
        + "El enlace es válido por " + PASSWORD_RESET_TOKEN_MINUTES
        + " minutos y solo puede usarse una vez. Hacé clic en el botón de abajo para continuar:",
```

Import estático de `com.knowlink.api.users.utils.Constants.PASSWORD_RESET_TOKEN_MINUTES`.

### 12. `users/controllers/interfaces/IUserController.java` (MODIFICAR)

Agregar documentación Swagger en español a los dos métodos de reset (sin cambiar rutas ni status):

```java
@PostMapping("/reset-password/email")
@Operation(summary = "Solicitar enlace de recuperación de contraseña",
        description = "Endpoint público. Responde siempre 204 sin revelar si el correo está registrado. "
                + "Si la cuenta existe y está activa, envía un enlace válido por 30 minutos.")
@ApiResponse(responseCode = "204", description = "Solicitud procesada")
@ApiResponse(responseCode = "400", description = "Correo vacío o con formato inválido")
@ResponseStatus(HttpStatus.NO_CONTENT)
void sendResetPasswordEmail(@RequestBody @Valid EmailRequest emailRequest);

@PostMapping("/reset-password")
@Operation(summary = "Restablecer contraseña con el enlace de recuperación",
        description = "Endpoint público. El enlace es de un solo uso y vence a los 30 minutos. "
                + "La nueva contraseña exige mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.")
@ApiResponse(responseCode = "204", description = "Contraseña actualizada")
@ApiResponse(responseCode = "400", description = "Contraseña inválida o las contraseñas no coinciden")
@ApiResponse(responseCode = "422", description = "Enlace usado, vencido o inválido (RESET_LINK_INVALID)")
@ResponseStatus(HttpStatus.NO_CONTENT)
void resetPassword(@RequestBody @Valid ResetPasswordRequest resetPasswordRequest);
```

## Tests (CREAR)

Seguir el patrón de `StudentProfileUpdateControllerTest` más `@RecordApplicationEvents` (`org.springframework.test.context.event.RecordApplicationEvents` + `@Autowired ApplicationEvents events;` y `events.stream(PasswordResetRequestedEvent.class).count()`).

### `src/test/java/com/knowlink/api/users/controllers/PasswordRecoveryControllerTest.java`

`@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Transactional @RecordApplicationEvents`. Repos `@Autowired` (`IUserRepository`, `ITokenRepository`), más `PasswordEncoder`. Seed por repositorios con **email y DNI únicos por clase de test** (p. ej. `ana.reset@test.com`, DNI `31000111`; un segundo usuario `beto.reset@test.com`, DNI `31000222`; un tercero INACTIVE). Los tokens de prueba se crean con `Token.builder().user(u).tokenType(...).tokenExpirationDate(...).build()` y `tokenRepository.save(...)`. **Todas las llamadas son anónimas** (sin `authentication(...)`): eso cubre que los endpoints son públicos (CA 1 del backend). `@DisplayName` con prefijo `CP-034.N`.

| ID | Verifica |
|---|---|
| CP-034.1 | 204 sin cuerpo con email de usuario ACTIVE; se crea 1 token `PASSWORD_RESET`; se publicó 1 `PasswordResetRequestedEvent` con ese `tokenId` |
| CP-034.2 | Vencimiento del token creado en CP-034.1 entre `now+29min` y `now+30min` (CA 3); un token `saveUserToken` (confirmación) vence ≈ 24 h |
| CP-034.3 | 204 con email inexistente: **mismo status y mismo body (vacío)** que CP-034.1; 0 tokens nuevos; 0 eventos (CA 2) |
| CP-034.4 | 204 con usuario INACTIVE: 0 tokens, 0 eventos |
| CP-034.5 | Con 3 tokens `PASSWORD_RESET` creados hoy, otra solicitud → **204 (no 429)**, sin token nuevo ni evento |
| CP-034.6 | 400 `detail=VALIDATION_ERROR` con `{"email":""}`, `{"email":"abc"}` y body `{}` |
| CP-034.7 | Reset OK: 204; `passwordEncoder.matches("Nueva#123", userReleído.getPassword())` es true; 0 tokens `PASSWORD_RESET` del usuario (CA 4 y 5) |
| CP-034.8 | Reusar el mismo token tras CP-034.7 → 422, `message = "Este enlace ya no es válido. Solicitá uno nuevo"`, `detail = RESET_LINK_INVALID` (CA 5 y 6) |
| CP-034.9 | Token vencido (`tokenExpirationDate = now-1min`) → 422 mismo mensaje; la contraseña NO cambia (CA 3 y 6) |
| CP-034.10 | UUID aleatorio inexistente → 422 mismo mensaje; token `"abc"` (no UUID) → 422 mismo mensaje; **nunca 500** |
| CP-034.11 | Token `ACCOUNT_CONFIRMATION` válido enviado a `/reset-password` → 422; token `PASSWORD_RESET` enviado a `POST /api/v1/users/{userId}/verify-account` de un usuario INACTIVE → 404 `TOKEN_NOT_FOUND` y la cuenta sigue INACTIVE |
| CP-034.12 | Contraseñas débiles (`"Ab#1"`, `"nueva#123"`, `"NUEVA#123"`, `"Nueva1234"`) → 400 `VALIDATION_ERROR`; la contraseña NO cambia y el token **sigue existiendo** (CA 4) |
| CP-034.13 | Contraseña válida con `confirmNewPassword` distinta → 400 `PASSWORDS_MISMATCH`; token intacto |
| CP-034.14 | Body `{}` y body sin `token` → 400 (no 500) |
| CP-034.15 | Con 2 tokens `PASSWORD_RESET` del usuario A y 1 del usuario B: resetear con uno de A elimina los 2 de A y **no** el de B |
| CP-034.16 | Token de reset de un usuario `DELETED` → 422 mismo mensaje; contraseña intacta |
| CP-034.17 | El token de confirmación de cuenta existente sigue activando la cuenta (`POST /{userId}/verify-account` → 202) — regresión del filtro por tipo |

Los asserts de error se hacen sobre `jsonPath("$.message")` y `jsonPath("$.detail")` (formato `ApiError`).

## No hacer

- No responder 404/429/400 ni mensajes distintos en `POST /reset-password/email` según exista o no la cuenta (CA 2). Todo caso con body válido es 204.
- No loguear emails ni tokens; solo `userId`.
- No tocar `GlobalExceptionHandler`: el 422 sale de `UnprocessableEntityException`. No usar `TokenExpiredException` en el reset (devuelve 401 y el frontend cierra sesión).
- No tocar `SecurityConfig` ni `SecurityConstants`. **Única excepción**: si CP-034.7 falla con 401/403 porque `"/api/v1/users/reset-password/**"` no cubre la ruta exacta `/api/v1/users/reset-password`, agregar `"/api/v1/users/reset-password"` a `PUBLIC_WHITELIST` y avisarlo en el PR.
- No cambiar el link del mail (`/auth/reset-password?token=`), el flujo de confirmación de cuenta ni `canResendToken`/`validateResendLimit`/`validateTokenNotExpired`.
- No refactorizar los requests de registro para usar `PASSWORD_REGEX` (US-01/US-42 los están definiendo).
- No agregar un endpoint de validación previa del enlace, ni hashear tokens, ni job de limpieza de tokens vencidos, ni rate limit por IP (fuera de alcance).
- No invalidar ni reemitir JWT al cambiar la contraseña (ver puntos a confirmar).
- No renombrar la tabla `tokens` ni la columna `token_expiration_date`.
- No reactivar ni editar `AuthServiceImplTest` (está comentado).
- Mensajes Jakarta en inglés; `UnprocessableEntityException.userMessage`, mail y Swagger en español.
- No usar `Optional.get()`, `@Autowired` en campos ni `System.out.println`.

## Verificación (correr y pegar el resultado)

```bash
grep -rn "findByTokenOrThrowException" src                           # solo verifyNewUser debe seguir usándolo
grep -rn "TokenExpiredException" src/main/java/com/knowlink/api/users/services   # sin resultados
./mvnw test -Dtest='PasswordRecoveryControllerTest'
./mvnw verify -B                                                     # lo que corre el CI; igual o mejor que la línea base
```

Chequeo manual en Swagger (`/swagger-ui.html`): los dos endpoints `reset-password` aparecen en el tag "Users" con descripción y respuestas 204/400/422 en español.

## Puntos a confirmar con el PO (informar en el PR, no bloquean)

1. **Sesiones abiertas**: el JWT es stateless (24 h). Tras cambiar la contraseña, los tokens ya emitidos siguen siendo válidos hasta vencer. Invalidarlos requiere un diseño aparte (p. ej. claim `passwordChangedAt`); no está en los criterios.
2. **Cuentas sin confirmar (INACTIVE)** no reciben el mail de reset (primero deben confirmar la cuenta). El criterio no lo menciona.
3. **Límite de 3 solicitudes por hora por usuario** (reutiliza la regla existente de reenvíos). Superado el límite, la respuesta sigue siendo el 204 genérico y no se envía mail.
4. **Varios enlaces vigentes a la vez**: solicitar otro enlace no invalida los anteriores; al restablecer, se invalidan todos.
5. **Token en claro**: es un UUID v4 aleatorio guardado sin hashear, con TTL de 30 min y un solo uso. Hashearlo queda fuera de esta historia.
6. **Sin validación previa del enlace**: el usuario ve "Este enlace ya no es válido" recién al enviar el formulario, no al abrir la página.
7. **Tokens vencidos no se purgan** (no hay job); quedan en la tabla `tokens` hasta una limpieza futura.
8. **Envío asíncrono sin reintento**: si el SMTP falla, el usuario igual ve el mensaje genérico y el error solo queda en logs.

## Commits (convención del repo: prefijo en inglés + descripción en español)

```
feat: agrega tipo de token y vigencia de 30 minutos para recuperar contraseña
fix: evita revelar si el correo existe al solicitar recuperación de contraseña
feat: valida requisitos de contraseña y enlace único al restablecerla
docs: documenta en swagger los endpoints de recuperación de contraseña
test: agrega tests de recuperación de contraseña
```

## Definition of Done

- [ ] `POST /api/v1/users/reset-password/email` responde 204 idéntico para cuenta existente, inexistente, INACTIVE y límite excedido (CA 2)
- [ ] Token de reset vence a los 30 minutos; el de confirmación sigue en 24 h (CA 3)
- [ ] `ResetPasswordRequest` valida mínimo 8, mayúscula, minúscula y carácter especial; `PASSWORDS_MISMATCH` si no coinciden (CA 4)
- [ ] Tras restablecer se eliminan todos los tokens `PASSWORD_RESET` del usuario; lock pesimista en la lectura del token (CA 5)
- [ ] Enlace usado/vencido/inexistente/malformado/de otro tipo → 422 `RESET_LINK_INVALID` con el mensaje exacto del CA 6
- [ ] Tokens de reset y de confirmación no son intercambiables
- [ ] Columna `token_type` mapeada con default + migración `migration-token-type.sql` agregada
- [ ] Mail de reset informa la vigencia de 30 minutos y el link no cambió
- [ ] `@Operation`/`@ApiResponse` en español en ambos endpoints
- [ ] Tests CP-034.1 a CP-034.17 en verde y `./mvnw verify -B` sin regresiones
- [ ] Sin cambios en `SecurityConfig`, `SecurityConstants` (salvo la excepción documentada) ni `GlobalExceptionHandler`
- [ ] Puntos a confirmar con el PO informados en la descripción del PR
- [ ] Code review aprobado
