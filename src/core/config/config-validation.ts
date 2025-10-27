import { validateSync, ValidationError } from 'class-validator';

export class ConfigValidation {
  static validationConfig(config: object) {
    const errors = validateSync(config);
    if (errors.length) {
      const sortedMessages = errors
        .map((error: ValidationError) =>
          Object.values(error.constraints || {}).join(', '),
        )
        .join('; ');
      throw new Error('Validation Failed: ' + sortedMessages);
    }
  }
}
