import { ValidationPipe, BadRequestException } from '@nestjs/common';

export function setupValidationPipeResponse() {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const formattedErrors = errors.reduce(
        (acc, err) => {
          if (err.constraints) {
            acc[err.property] = Object.values(err.constraints);
          }
          return acc;
        },
        {} as Record<string, string[]>,
      );

      return new BadRequestException({
        status: false,
        message: formattedErrors,
      });
    },
  });
}
