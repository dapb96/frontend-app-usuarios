export interface DatosPersonales {
    nifPasaporte: string;
    nombre: string;
    primerApellido: string;
    segundoApellido?: string;
    genero?: string;
    fechaNacimiento?: Date;
  }
  
  export interface Direccion {
    calle: string;
    numero?: string;
    puerta?: string;
    codigoPostal: string;
    ciudad: string;
  }
  
  export interface Estudio {
    nombreInstitucion: string;
    titulacion: string;
    fecha?: Date;
  }
  
  export interface ExperienciaLaboral {
    nombreEmpresa: string;
    puestoTrabajo: string;
    fecha?: Date;
  }
  
  export interface Demandante {
    tipo: 'demandante';
    datosPersonales: DatosPersonales;
    direccion: Direccion;
    estudios: Estudio[];
  }
  
  export interface Empleado {
    tipo: 'empleado';
    datosPersonales: DatosPersonales;
    direccion: Direccion;
    experienciaLaboral: ExperienciaLaboral[];
  }
  
  export type User = Demandante | Empleado;