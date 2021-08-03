import { SetMetadata } from '@nestjs/common';
//recebe como parâmetro um perfil de usuário armazenar ele nos metadados
export const Role = (role: string) => SetMetadata('role', role);
