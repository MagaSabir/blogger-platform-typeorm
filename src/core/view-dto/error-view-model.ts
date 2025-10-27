import { ApiProperty } from '@nestjs/swagger';

export class ErrorMessage {
  @ApiProperty()
  message: string;
  @ApiProperty()
  field: string;
}

export class ErrorViewModel {
  @ApiProperty({
    type: [ErrorMessage],
    description: 'List of errors',
  })
  errorMessages: ErrorMessage[];
}
