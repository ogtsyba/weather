import type { TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TypeBoxValidationPipe implements PipeTransform {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown) {
    if (Value.Check(this.schema, value)) {
      return value;
    }

    // Collect and format errors for a more informative response
    const errors = [...Value.Errors(this.schema, value)]
      .map((e) => `${e.path}: ${e.message}`)
      .join(', ');
    throw new BadRequestException(`Validation failed: ${errors}`);
  }
}
