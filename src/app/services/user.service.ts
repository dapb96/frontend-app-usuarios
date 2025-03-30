import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      "tipo": "demandante",
      "datosPersonales": {
        "nifPasaporte": "12345678A",
        "nombre": "Juan",
        "primerApellido": "Pérez",
        "segundoApellido": "Gómez",
        "genero": "Masculino",
        "fechaNacimiento": new Date("1990-05-15")
      },
      "direccion": {
        "calle": "Calle Falsa",
        "numero": "123",
        "puerta": "A",
        "codigoPostal": "08001",
        "ciudad": "Barcelona"
      },
      "estudios": [
        {
          "nombreInstitucion": "Universidad de Barcelona",
          "titulacion": "Ingeniería Informática",
          "fecha": new Date("2015-06-30")
        }
      ]
    },
    {
      "tipo": "empleado",
      "datosPersonales": {
        "nifPasaporte": "98765432B",
        "nombre": "Ana",
        "primerApellido": "López",
        "segundoApellido": "Martínez",
        "genero": "Femenino",
        "fechaNacimiento": new Date("1985-11-20")
      },
      "direccion": {
        "calle": "Avenida Siempreviva",
        "numero": "45",
        "codigoPostal": "28001",
        "ciudad": "Madrid"
      },
      "experienciaLaboral": [
        {
          "nombreEmpresa": "Google",
          "puestoTrabajo": "Desarrolladora",
          "fecha": new Date("2020-01-15")
        }
      ]
    }
  ];

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  addUser(user: User): void {
    const currentUsers = this.users;
    this.users = [...currentUsers, user];
    this.saveUsers(); // Simulación de guardado
  }

  updateUser(updatedUser: User): void {
    const currentUsers = this.users;
    const updatedUsers = currentUsers.map(user =>
      user.datosPersonales.nifPasaporte === updatedUser.datosPersonales.nifPasaporte ? updatedUser : user
      
    );
    const index = this.users.findIndex(user => user.datosPersonales.nifPasaporte === updatedUser.datosPersonales.nifPasaporte);
    if (index >= 0 && index < this.users.length) {
      this.users[index] = updatedUser;
    } else {
      console.log(`Índice ${index} fuera de rango.`);
    }
    this.saveUsers(); // Simulación de guardado
  }

  deleteUser(nifPasaporte: string): void {
    const currentUsers = this.users;
    const index = currentUsers.findIndex(user => user.datosPersonales.nifPasaporte !== nifPasaporte);

    if (index >= 0 && index < this.users.length) {
      this.users.splice(index, 1);
    } else {
      console.log(`Índice ${index} fuera de rango.`);
    }
    
    this.saveUsers(); // Simulación de guardado
  }

  private saveUsers(): void {
    // Aquí podrías realizar una llamada HTTP para guardar los datos en el servidor.
    // Por ahora, solo se simula el guardado mostrando el estado en la consola.
    console.log('Usuarios guardados (simulación):', this.users);
  }
}
